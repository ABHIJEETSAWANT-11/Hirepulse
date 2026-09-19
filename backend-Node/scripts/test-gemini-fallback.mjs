// Standalone harness for utils/gemini.js — no network, no API key needed.
// Mocks axios's HTTP adapter to simulate Gemini responses (429 daily quota,
// 429 per-minute, invalid key, empty candidates, model failover) and asserts
// the fallback chain's classification, retries, and error codes.
//
//   node scripts/test-gemini-fallback.mjs
//
import axios from "axios"

// 1 attempt per model + tiny backoff cap keeps the run fast (no multi-second
// sleeps to wait out). Individual tests override these via re-import.
process.env.GEMINI_ATTEMPTS_PER_MODEL = "1"
process.env.GEMINI_MAX_BACKOFF_MS = "150"

const { callGeminiWithFallback, getGeminiStatus, GEMINI_MODELS } = await import("../utils/gemini.js")

const FAKE_KEY = "test-key-not-real"

// A Gemini-shaped daily-quota 429 body (QuotaFailure + RetryInfo details).
const daily429 = () => ({
  error: {
    code: 429,
    message: "Generative AI API free tier requests per day quota limit exceeded.",
    status: "RESOURCE_EXHAUSTED",
    details: [
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        violations: [
          {
            quotaMetric:
              "generativelanguage.googleapis.com/generate_content_free_tier_requests/PerDayPerProject",
          },
        ],
      },
      { "@type": "type.googleapis.com/google.rpc.RetryInfo", retryDelay: "27s" },
    ],
  },
})
const minute429 = () => ({
  error: { code: 429, message: "Rate limit exceeded", status: "RESOURCE_EXHAUSTED" },
})
const invalidKey400 = () => ({
  error: { code: 400, message: "API key not valid. Please pass a valid API key.", status: "INVALID_ARGUMENT" },
})
const ok200 = (text) => ({ candidates: [{ content: { parts: [{ text }] }, finishReason: "STOP" }] })

// Adapter-level mock: routes each request to a scripted response and counts calls.
const installMock = (script) => {
  const calls = []
  axios.defaults.adapter = async (config) => {
    const url = String(config.url || "")
    const model = url.match(/models\/([^:]+):/)?.[1] || "?"
    calls.push({ model })
    return script(calls.length, model)
  }
  return calls
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let passed = 0
const check = (name, cond, extra = "") => {
  if (cond) {
    passed++
    console.log(`  PASS  ${name}${extra ? ` — ${extra}` : ""}`)
  } else {
    console.error(`  FAIL  ${name}${extra ? ` — ${extra}` : ""}`)
    process.exitCode = 1
  }
}

console.log("Test 1: missing API key → AI_KEY_MISSING, zero HTTP calls")
{
  const calls = installMock(() => ok200("hi"))
  let err = null
  try {
    await callGeminiWithFallback("prompt", undefined, { label: "t1" })
  } catch (e) {
    err = e
  }
  check("throws AI_KEY_MISSING", err?.code === "AI_KEY_MISSING", `code=${err?.code}`)
  check("no HTTP call attempted", calls.length === 0, `calls=${calls.length}`)
}

console.log("Test 2: daily-quota 429 on every model → GEMINI_ALL_EXHAUSTED + dailyQuotaExceeded")
{
  const calls = installMock(() => ({ status: 429, data: daily429() }))
  let err = null
  const t0 = Date.now()
  try {
    await callGeminiWithFallback("prompt", FAKE_KEY, { label: "t2" })
  } catch (e) {
    err = e
  }
  check("throws GEMINI_ALL_EXHAUSTED", err?.code === "GEMINI_ALL_EXHAUSTED", `code=${err?.code}`)
  check("dailyQuotaExceeded=true", err?.dailyQuotaExceeded === true)
  check(
    "one request per model (ATTEMPTS=1)",
    calls.length === GEMINI_MODELS.length,
    `calls=${calls.length}, models=${GEMINI_MODELS.length}`
  )
  check("daily quota flag set in state", getGeminiStatus().lastErrorKind === "GEMINI_ALL_EXHAUSTED")

  // Now with 2 attempts/model: the API's 27s RetryInfo hint must be honored
  // (capped to GEMINI_MAX_BACKOFF_MS=150 here so the test stays fast).
  // Fresh mock so the call counter restarts for this sub-run.
  process.env.GEMINI_ATTEMPTS_PER_MODEL = "2"
  const fresh = await import(`../utils/gemini.js?hint=${Date.now()}`)
  const calls2 = installMock(() => ({ status: 429, data: daily429() }))
  let err2 = null
  const t1 = Date.now()
  try {
    await fresh.callGeminiWithFallback("prompt", FAKE_KEY, { label: "t2b" })
  } catch (e) {
    err2 = e
  }
  check("2-attempt run still exhausts chain", err2?.code === "GEMINI_ALL_EXHAUSTED")
  check(
    "honored (capped) retry hint between attempts",
    Date.now() - t1 >= 400,
    `elapsed≈${Date.now() - t1}ms (3 models × 1 hint-capped sleep)`
  )
  check("2 attempts per model attempted", calls2.length === GEMINI_MODELS.length * 2, `calls=${calls2.length}`)
  process.env.GEMINI_ATTEMPTS_PER_MODEL = "1"
}

console.log("Test 3: per-minute 429 on primary → fails over to model #2 and succeeds")
{
  installMock((_n, model) =>
    model === GEMINI_MODELS[0]
      ? { status: 429, data: minute429() }
      : { status: 200, data: ok200("Recovered answer from fallback model") }
  )
  const text = await callGeminiWithFallback("prompt", FAKE_KEY, { label: "t3" })
  const st = getGeminiStatus()
  check("got AI text from fallback model", text.includes("Recovered answer from fallback model"), text)
  check("status.lastModelUsed = fallback model", st.lastModelUsed === GEMINI_MODELS[1], st.lastModelUsed)
  check("status.totalFallbacks = 1", st.totalFallbacks === 1, String(st.totalFallbacks))
  check("status.consecutiveFailures reset", st.consecutiveFailures === 0)
}

console.log("Test 4: invalid key → AI_KEY_REJECTED thrown immediately (chain aborted)")
{
  const calls = installMock(() => ({ status: 400, data: invalidKey400() }))
  let err = null
  try {
    await callGeminiWithFallback("prompt", FAKE_KEY, { label: "t4" })
  } catch (e) {
    err = e
  }
  check("throws AI_KEY_REJECTED", err?.code === "AI_KEY_REJECTED", `code=${err?.code}`)
  check("did NOT try remaining models", calls.length === 1, `calls=${calls.length}`)
}

console.log("Test 5: 200 with empty candidates (safety block) → advances to next model")
{
  installMock((_n, model) =>
    model === GEMINI_MODELS[0]
      ? { status: 200, data: { candidates: [], promptFeedback: { blockReason: "SAFETY" } } }
      : { status: 200, data: ok200("Recovered on second model") }
  )
  const text = await callGeminiWithFallback("prompt", FAKE_KEY, { label: "t5" })
  check("recovered on next model", text.includes("Recovered on second model"), text)
}

console.log("Test 6: transient 500 retried on same model (default ATTEMPTS_PER_MODEL=2)")
{
  process.env.GEMINI_ATTEMPTS_PER_MODEL = "2"
  // Re-import so the new env value is picked up (read once at module load).
  const fresh = await import(`../utils/gemini.js?cachebust=${Date.now()}`)
  let hits = 0
  installMock(() => {
    hits++
    return hits <= 2 ? { status: 500, data: { error: { status: "INTERNAL" } } } : { status: 200, data: ok200("ok after 500s") }
  })
  const text = await fresh.callGeminiWithFallback("prompt", FAKE_KEY, { label: "t6" })
  check("succeeded on 3rd attempt", hits === 3 && text === "ok after 500s", `hits=${hits}`)
  process.env.GEMINI_ATTEMPTS_PER_MODEL = "1"
}

console.log("Test 7: per-call log lines present")
{
  const logs = []
  const orig = console.log
  console.log = (...args) => {
    logs.push(args.join(" "))
    orig(...args)
  }
  installMock(() => ({ status: 200, data: ok200("logged") }))
  await callGeminiWithFallback("prompt", FAKE_KEY, { label: "log-check" })
  console.log = orig
  const attemptLine = logs.find((l) => l.includes("[GEMINI]") && l.includes("model=") && l.includes("status="))
  const callLine = logs.find((l) => l.includes("[GEMINI-CALL]") && l.includes("success=true") && l.includes("model_used="))
  check("[GEMINI] attempt line logged", !!attemptLine)
  check("[GEMINI-CALL] summary line logged", !!callLine)
}

console.log(`\n${passed} checks passed${process.exitCode ? " (with failures)" : ""}`)
