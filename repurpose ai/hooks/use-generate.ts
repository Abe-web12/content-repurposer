"use client";

import { useState, useCallback } from "react";
import type { InputType, OutputFormat } from "@/lib/constants/formats";
import type { VoiceProfile } from "@/lib/supabase/types";
import { useUsage } from "@/components/providers/usage-provider";
import { showError } from "@/components/ui/toast";

export type GenerateStep = "input" | "format" | "generating" | "output";

interface GenerateState {
  step: GenerateStep;
  inputType: InputType;
  inputValue: string;
  extractedContent: string;
  sourceTitle: string;
  outputFormat: OutputFormat;
  voiceProfile: VoiceProfile | null;
  generatedContent: string;
  generationId: string | null;
  isExtracting: boolean;
  isAnalyzing: boolean;
  isGenerating: boolean;
  error: string | null;
}

const initialState: GenerateState = {
  step: "input",
  inputType: "youtube_url",
  inputValue: "",
  extractedContent: "",
  sourceTitle: "",
  outputFormat: "linkedin_post",
  voiceProfile: null,
  generatedContent: "",
  generationId: null,
  isExtracting: false,
  isAnalyzing: false,
  isGenerating: false,
  error: null,
};

export function useGenerate() {
  const [state, setState] = useState<GenerateState>(initialState);
  const { canUserGenerate, incrementUsage } = useUsage();

  const updateState = useCallback((updates: Partial<GenerateState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const setInputType = useCallback((inputType: InputType) => {
    updateState({ inputType, inputValue: "", error: null });
  }, [updateState]);

  const setInputValue = useCallback((inputValue: string) => {
    updateState({ inputValue, error: null });
  }, [updateState]);

  const setOutputFormat = useCallback((outputFormat: OutputFormat) => {
    updateState({ outputFormat });
  }, [updateState]);

  const setVoiceProfile = useCallback((voiceProfile: VoiceProfile | null) => {
    updateState({ voiceProfile });
  }, [updateState]);

  const extract = useCallback(async () => {
    if (!state.inputValue.trim()) {
      updateState({ error: "Please enter content to repurpose." });
      return false;
    }

    updateState({ isExtracting: true, error: null });

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: state.inputValue.trim(),
          input_type: state.inputType,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        const errMsg = typeof json.error === "string" ? json.error : "Extraction failed";
        updateState({ isExtracting: false, error: errMsg });
        return false;
      }

      updateState({
        isExtracting: false,
        extractedContent: json.data.content,
        sourceTitle: json.data.title,
        step: "format",
      });

      return true;
    } catch (err: any) {
      updateState({ isExtracting: false, error: err.message || "Network error" });
      return false;
    }
  }, [state.inputValue, state.inputType, updateState]);

  const generate = useCallback(async () => {
    if (!canUserGenerate) {
      showError("You've reached your generation limit. Upgrade to continue.");
      return false;
    }

    updateState({ isAnalyzing: true, isGenerating: false, generatedContent: "", error: null, step: "generating" });

    try {
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: state.extractedContent,
          source_type: state.inputType.replace("_url", "").replace("raw_", ""),
        }),
      });

      const analyzeJson = await analyzeResponse.json();

      if (!analyzeResponse.ok) {
        updateState({ isAnalyzing: false, error: analyzeJson.error || "Analysis failed", step: "format" });
        return false;
      }

      updateState({ isAnalyzing: false, isGenerating: true });

      // 90 second timeout for generation (streams can be long)
      const generateController = new AbortController();
      const generateTimeout = setTimeout(() => generateController.abort(), 90000);

      let generateResponse: Response;
      try {
        generateResponse = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: generateController.signal,
          body: JSON.stringify({
            content: analyzeJson.data.analysis,
            output_format: state.outputFormat,
            voice_profile_id: state.voiceProfile?.id || null,
          }),
        });
      } catch (fetchErr: any) {
        clearTimeout(generateTimeout);
        if (fetchErr.name === "AbortError") {
          updateState({ isGenerating: false, error: "Generation timed out. Try a shorter source.", step: "format" });
          return false;
        }
        throw fetchErr;
      }
      clearTimeout(generateTimeout);

      if (!generateResponse.ok) {
        const errorJson = await generateResponse.json();
        updateState({ isGenerating: false, error: errorJson.error || "Generation failed", step: "format" });
        return false;
      }

      const reader = generateResponse.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let generationId: string | null = null;

      if (!reader) {
        updateState({ isGenerating: false, error: "Failed to read response stream", step: "format" });
        return false;
      }

      // Read with inactivity timeout
      let lastChunkTime = Date.now();
      const STREAM_INACTIVITY_MS = 30000;

      // Buffer for SSE events split across TCP chunks
      let incomplete = "";

      while (true) {
        if (Date.now() - lastChunkTime > STREAM_INACTIVITY_MS) {
          updateState({ isGenerating: false, error: "Generation stalled. Try again.", step: "format" });
          return false;
        }

        const { done, value } = await reader.read();
        if (done) break;

        lastChunkTime = Date.now();

        // Use { stream: true } to preserve multi-byte UTF-8 chars split across chunks
        const text = decoder.decode(value, { stream: true });
        const lines = (incomplete + text).split("\n");
        incomplete = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            let parsed;
            try {
              parsed = JSON.parse(line.slice(6));
            } catch {
              console.warn("[SSE] Malformed chunk skipped:", line.slice(6, 50));
              continue;
            }

            if (parsed.error) {
              updateState({ isGenerating: false, error: parsed.error, step: "format" });
              return false;
            }

            if (parsed.text) {
              fullContent += parsed.text;
              setState((prev) => ({ ...prev, generatedContent: fullContent }));
            }

            if (parsed.done) {
              generationId = parsed.generation_id || null;
            }
          }
        }
      }

      updateState({
        isGenerating: false,
        generatedContent: fullContent,
        generationId,
        step: "output",
      });

      incrementUsage();
      return true;
    } catch (err: any) {
      updateState({ isAnalyzing: false, isGenerating: false, error: err.message || "Generation failed", step: "format" });
      return false;
    }
  }, [state.extractedContent, state.outputFormat, state.voiceProfile, state.inputType, canUserGenerate, updateState, incrementUsage]);

  const regenerate = useCallback(async () => {
    updateState({ generatedContent: "", generationId: null });
    return generate();
  }, [generate, updateState]);

  return {
    ...state,
    setInputType,
    setInputValue,
    setOutputFormat,
    setVoiceProfile,
    extract,
    generate,
    regenerate,
    reset,
  };
}
