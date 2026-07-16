const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
const HEALTH_URL = `${APP_URL.replace(/\/+$/, "")}/api/health`

interface CheckResult {
  status: "ok" | "fail"
  message?: string
}

interface HealthResponse {
  status: "ok" | "fail"
  timestamp: string
  version: string
  name: string
  checks: Record<string, CheckResult>
}

function pass(label: string, message?: string): void {
  const icon = "\u2705"
  const msg = message ? ` ${message}` : ""
  console.log(`  ${icon}  ${label}${msg}`)
}

function fail(label: string, message?: string): void {
  const icon = "\u274C"
  const msg = message ? ` ${message}` : ""
  console.log(`  ${icon}  ${label}${msg}`)
}

function divider(): void {
  console.log("  " + "\u2500".repeat(50))
}

async function main() {
  console.log("")
  console.log("  \u{1F3AF}  RepurposeAI - Connection Verification")
  console.log("  " + "\u2500".repeat(50))

  console.log(`  Target: ${HEALTH_URL}\n`)

  let response: Response

  try {
    response = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(10_000) })
  } catch (error) {
    fail(
      "Network",
      error instanceof Error ? error.message : "Failed to reach health endpoint"
    )
    console.log("")
    process.exit(1)
  }

  if (!response.ok && response.status !== 500) {
    fail("HTTP", `Status ${response.status} ${response.statusText}`)
    console.log("")
    process.exit(1)
  }

  let body: HealthResponse

  try {
    body = (await response.json()) as HealthResponse
  } catch {
    fail("Parse", "Response was not valid JSON")
    console.log("")
    process.exit(1)
  }

  divider()

  const summary = body.status === "ok" ? "\u2705  OVERALL: PASS" : "\u274C  OVERALL: FAIL"
  console.log(`  ${summary}`)
  console.log(`  App:      ${body.name} v${body.version}`)
  console.log(`  Time:     ${body.timestamp}`)
  divider()

  for (const [service, result] of Object.entries(body.checks)) {
    const label = service.charAt(0).toUpperCase() + service.slice(1)
    if (result.status === "ok") {
      pass(label)
    } else {
      fail(label, result.message)
    }
  }

  divider()
  console.log("")

  if (body.status !== "ok") {
    process.exit(1)
  }
}

main()
