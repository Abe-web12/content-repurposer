const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://api.morphllm.com";
const LLM_API_KEY = process.env.LLM_API_KEY || "";
export const AI_MODEL = process.env.AI_MODEL || "morph-glm52-744b";

interface LlmChunk {
  text(): string;
}

async function* streamChat(prompt: string): AsyncGenerator<LlmChunk> {
  const response = await fetch(`${LLM_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`LLM API error ${response.status}: ${body}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("LLM API returned no body");

  const decoder = new TextDecoder();
  let incomplete = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    const lines = (incomplete + text).split("\n");
    incomplete = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") return;

      try {
        const json = JSON.parse(payload);
        const content = json.choices?.[0]?.delta?.content || "";
        if (content) {
          yield { text: () => content };
        }
      } catch {
        // skip malformed chunks
      }
    }
  }
}

export async function generateStream(prompt: string) {
  return streamChat(prompt);
}

export async function generateComplete(prompt: string): Promise<{
  content: string;
  model: string;
}> {
  const response = await fetch(`${LLM_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      stream: false,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`LLM API error ${response.status}: ${body}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content || "";

  return { content, model: AI_MODEL };
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${LLM_BASE_URL}/v1/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Embedding API error ${response.status}: ${body}`);
  }

  const json = await response.json();
  return json.data?.[0]?.embedding || [];
}
