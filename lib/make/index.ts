const MAKE_API_KEY = process.env.MAKE_API_KEY!

export async function triggerWebhook(
  webhookUrl: string,
  payload: Record<string, unknown>
): Promise<Response> {
  return fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MAKE_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })
}
