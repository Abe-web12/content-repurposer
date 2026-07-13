"use client";

import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { InputStep } from "@/components/generate/input-step";
import { FormatSelector } from "@/components/generate/format-selector";
import { VoiceSelector } from "@/components/generate/voice-selector";
import { GenerateButton } from "@/components/generate/generate-button";
import { OutputDisplay } from "@/components/generate/output-display";
import { ActionBar } from "@/components/generate/action-bar";
import { useGenerate } from "@/hooks/use-generate";
import { useVoiceProfiles } from "@/hooks/use-voice-profiles";
import { useUsage } from "@/components/providers/usage-provider";
import { cn } from "@/lib/utils";

export default function GeneratePage() {
  const {
    step,
    inputType,
    inputValue,
    extractedContent,
    sourceTitle,
    outputFormat,
    voiceProfile,
    generatedContent,
    isExtracting,
    isAnalyzing,
    isGenerating,
    error,
    setInputType,
    setInputValue,
    setOutputFormat,
    setVoiceProfile,
    extract,
    generate,
    regenerate,
    reset,
  } = useGenerate();

  const { profiles, defaultProfile } = useVoiceProfiles();
  const { canUserGenerate, remaining, plan } = useUsage();

  useEffect(() => {
    if (defaultProfile && !voiceProfile) {
      setVoiceProfile(defaultProfile);
    }
  }, [defaultProfile, voiceProfile, setVoiceProfile]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Generate Content"
        description="Paste a source, pick a format, and get publish-ready content in seconds."
      />

      <div className="flex items-center gap-2">
        <StepDot active={step === "input"} completed={step !== "input"} label="1. Source" />
        <div className="h-px flex-1 bg-surface-3" />
        <StepDot
          active={step === "format"}
          completed={step === "generating" || step === "output"}
          label="2. Format"
        />
        <div className="h-px flex-1 bg-surface-3" />
        <StepDot active={step === "generating" || step === "output"} completed={step === "output"} label="3. Output" />
      </div>

      {step === "input" && (
        <section className="space-y-6">
          <InputStep
            inputType={inputType}
            inputValue={inputValue}
            onTypeChange={setInputType}
            onValueChange={setInputValue}
            error={error}
          />

          <div className="flex justify-end">
            <Button
              onClick={extract}
              loading={isExtracting}
              disabled={!inputValue.trim()}
            >
              Extract content
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      )}

      {step === "format" && (
        <section className="space-y-8">
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Content extracted: {sourceTitle}
              </span>
            </div>
            <p className="mt-1 text-xs text-green-700">
              {extractedContent.split(/\s+/).length} words extracted.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Output format</h3>
            <FormatSelector selected={outputFormat} onChange={setOutputFormat} />
          </div>

          <VoiceSelector
            profiles={profiles}
            selected={voiceProfile}
            onChange={setVoiceProfile}
          />

          {!canUserGenerate && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm font-medium text-amber-800">
                You've used all your generations. Upgrade to continue.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={reset}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <GenerateButton
              onClick={generate}
              loading={isAnalyzing || isGenerating}
              disabled={!canUserGenerate}
              label={
                isAnalyzing
                  ? "Analyzing..."
                  : isGenerating
                  ? "Generating..."
                  : `Generate (${remaining} left)`
              }
            />
          </div>
        </section>
      )}

      {step === "generating" && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
            <p className="text-sm font-medium text-text-primary">
              {isAnalyzing ? "Analyzing your content..." : "Generating your content..."}
            </p>
          </div>

          {generatedContent && (
            <OutputDisplay
              format={outputFormat}
              content={generatedContent}
              streaming={true}
            />
          )}
        </section>
      )}

      {step === "output" && (
        <section className="space-y-6">
          <OutputDisplay
            format={outputFormat}
            content={generatedContent}
            streaming={false}
          />

          <ActionBar
            content={generatedContent}
            onRegenerate={regenerate}
            onReset={reset}
            regenerating={isGenerating}
          />
        </section>
      )}
    </div>
  );
}

function StepDot({
  active,
  completed,
  label,
}: {
  active: boolean;
  completed: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "h-3 w-3 rounded-full transition-colors",
          completed ? "bg-green-500" : active ? "bg-brand-600" : "bg-surface-3"
        )}
      />
      <span
        className={cn(
          "hidden text-xs font-medium sm:inline",
          active ? "text-text-primary" : "text-text-muted"
        )}
      >
        {label}
      </span>
    </div>
  );
}
