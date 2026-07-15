import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured. Add it to your .env.local file.");
    }
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

export interface GeminiExtraction {
  keyPoints: string[];
  summary: string;
  hooks: string[];
  topics: string[];
}

const EXTRACTION_PROMPT = `You are a content analysis expert. Analyze the following transcript and extract:

1. Key Points: the 5–7 most important points or arguments discussed.
2. Summary: a concise 2–3 sentence overview of the content.
3. Hooks: 3–4 attention-grabbing opening lines suitable for LinkedIn, X, or blog intros.
4. Topics: the main topics or themes covered.

Return ONLY valid JSON with this exact structure — no markdown, no code fences:
{
  "keyPoints": ["..."],
  "summary": "...",
  "hooks": ["..."],
  "topics": ["..."]
}

TRANSCRIPT:
`;

export async function extractKeyPoints(transcript: string): Promise<GeminiExtraction> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: process.env.AI_MODEL || "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  });

  const truncated = transcript.slice(0, 30000);
  const result = await model.generateContent(EXTRACTION_PROMPT + truncated);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Gemini response did not contain valid JSON");
  }

  let parsed: Partial<GeminiExtraction>;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Failed to parse Gemini extraction response as JSON");
  }

  return {
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
    hooks: Array.isArray(parsed.hooks) ? parsed.hooks : [],
    topics: Array.isArray(parsed.topics) ? parsed.topics : [],
  };
}
