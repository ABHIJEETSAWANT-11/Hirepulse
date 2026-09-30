import axios from "axios"

// ─────────────────────────────────────────────────────────────
// Gemini client: multi-model fallback chain + quota-aware retry
// ─────────────────────────────────────────────────────────────
// Each model has its OWN rate-limit buckets (RPM / TPM / RPD), so
// hopping to the next model on a 429 multiplies effective free-tier
// capacity instead of waiting out a single bucket.
//
// Chain verified live against the Generative Language API on Sept 2026
// (this key's project): gemini-2.5-flash / -lite return 404 NOT_FOUND for
// generateContent, while the aliases below all return 200. Aliases track
// Google's current recommended model, so the chain survives their fast,
// rolling deprecation cadence. Re-check if calls start 404-ing.
const GEMINI_MODELS = [
  "gemini-flash-latest", // primary — always-current flash alias, best price/performance
  "gemini-flash-lite-latest", // fallback 1 — cheapest/fastest, separate quota bucket
  "gemini-3.1-flash-lite", // fallback 2 — newest generation, longest runway
]

// Attempts per model = 1 initial call + retries. Default 2 (one retry)
// with exponential backoff (1s, 2s, 4s…), so a transient per-minute 429
// is absorbed without immediately burning the whole chain.
// Tune via .env: GEMINI_ATTEMPTS_PER_MODEL (1–4).
const ATTEMPTS_PER_MODEL = Math.min(
  Math.max(parseInt(process.env.GEMINI_ATTEMPTS_PER_MODEL || "2", 10) || 2, 1),
  4
)
// Never hold an HTTP request open longer than this between attempts —
// the frontend fetch has its own patience limits.
// Tune via .env: GEMINI_MAX_BACKOFF_MS.
const MAX_BACKOFF_MS = Math.min(
  Math.max(parseInt(process.env.GEMINI_MAX_BACKOFF_MS || "8000", 10) || 8000, 250),
  30000
)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * All configured Gemini API keys, in priority order.
 * Reads GEMINI_API_KEY + GEMINI_BACKUP_KEY_1/2 individually, and optionally a
 * comma-separated GEMINI_API_KEYS batch. Deduped; server-side only — these
 * never reach the frontend — keys stay in the backend.
 */
const getGeminiApiKeys = () => {
  const raw = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_BACKUP_KEY_1,
    process.env.GEMINI_BACKUP_KEY_2,
    ...(process.env.GEMINI_API_KEYS
      ? String(process.env.GEMINI_API_KEYS).split(",")
      : []),
  ]
  const seen = new Set()
  return raw
    .map((k) => (k || "").trim())
    .filter((k) => {
      if (!k || seen.has(k)) return false
      seen.add(k)
      return true
    })
}

// Rolling call state, surfaced by GET /interview/status
const geminiState = {
  lastModelUsed: null,
  lastSuccessAt: null,
  lastFailureAt: null,
  lastError: null,
  lastErrorKind: null,
  consecutiveFailures: 0,
  totalCalls: 0,
  totalFallbacks: 0, // calls where model #2 or #3 had to take over
}

// One line per API attempt: timestamp, call type, model, attempt,
// status, error code, latency, planned retry delay.
const logAttempt = ({ label, key, model, attempt, status, error, latencyMs, retryInMs }) => {
  const keyLabel = key ? ` key=${key}` : ""
  console.log(
    `[GEMINI] ${new Date().toISOString()} call=${label}${keyLabel} model=${model} attempt=${attempt} ` +
      `status=${status}` +
      `${error ? ` error=${error}` : ""}` +
      ` latency=${latencyMs}ms` +
      `${retryInMs ? ` retry_in=${retryInMs}ms` : ""}`
  )
}

// Extract structured quota info from a Gemini error body:
// { error: { status: "RESOURCE_EXHAUSTED", details: [
//   { "@type": "...RetryInfo", retryDelay: "27s" },
//   { "@type": "...QuotaFailure", violations: [{ quotaMetric:
//     "generativelanguage.googleapis.com/.../PerDay" }] } ] } }
const classifyQuotaError = (resp) => {
  const body = JSON.stringify(resp?.data || {})
  const apiStatus = resp?.data?.error?.status || null
  const details = resp?.data?.error?.details || []
  let retryDelayMs = null
  let daily = /PerDay|PER_DAY|DailyLimit|DAILY_LIMIT/i.test(body)
  for (const d of details) {
    if (!d || typeof d !== "object") continue
    if (String(d["@type"] || "").includes("RetryInfo") && d.retryDelay) {
      const m = String(d.retryDelay).match(/([\d.]+)s/)
      if (m) retryDelayMs = Math.round(parseFloat(m[1]) * 1000)
    }
    if (String(d["@type"] || "").includes("QuotaFailure") && Array.isArray(d.violations)) {
      for (const v of d.violations) {
        if (/perday|per_day|daily/i.test(String(v.quotaMetric || ""))) daily = true
      }
    }
  }
  return { apiStatus, retryDelayMs, daily }
}

const backoffMs = (attempt, hintMs) => {
  if (hintMs) return Math.min(hintMs, MAX_BACKOFF_MS) // respect the API's own retry hint
  return Math.min(1000 * 2 ** (attempt - 1), MAX_BACKOFF_MS) // 1s, 2s, 4s…
}

/**
 * Tries GEMINI_MODELS in order across provided API key(s) with per-model retries
 * and exponential backoff.
 * apiKeyOrKeys can be a single API key string or an array of key strings.
 * If key 1 fails (key rejection or quota exhaustion on all models), falls back to key 2.
 * opts: { label, generationConfig }
 * Throws an Error with .code = "AI_KEY_MISSING" | "AI_KEY_REJECTED" |
 * "GEMINI_ALL_EXHAUSTED" (+ .dailyQuotaExceeded boolean).
 */
const callGeminiWithFallback = async (prompt, apiKeyOrKeys, opts = {}) => {
  const label = opts.label || "ai"
  const startedAt = Date.now()

  let keys = []
  if (Array.isArray(apiKeyOrKeys)) {
    keys = apiKeyOrKeys.filter((k) => typeof k === "string" && k.trim().length > 0)
  } else if (typeof apiKeyOrKeys === "string" && apiKeyOrKeys.trim().length > 0) {
    keys = [apiKeyOrKeys.trim()]
  }

  if (keys.length === 0) {
    geminiState.totalCalls += 1
    geminiState.lastError = "GEMINI_API_KEY is not set"
    geminiState.lastErrorKind = "AI_KEY_MISSING"
    geminiState.lastFailureAt = new Date().toISOString()
    geminiState.consecutiveFailures += 1
    throw Object.assign(
      new Error("GEMINI_API_KEY is not configured. Set it in backend-Node/.env and restart the backend."),
      { code: "AI_KEY_MISSING" }
    )
  }

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    ...(opts.generationConfig ? { generationConfig: opts.generationConfig } : {}),
  }

  let lastError = null
  let sawDailyQuota = false
  let sawKeyRejection = false

  geminiState.totalCalls += 1

  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    const apiKey = keys[keyIndex]
    const keyNum = keyIndex + 1

    let keyRejected = false

    for (let modelIndex = 0; modelIndex < GEMINI_MODELS.length; modelIndex++) {
      const model = GEMINI_MODELS[modelIndex]
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

      for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt++) {
        const t0 = Date.now()
        try {
          const resp = await axios.post(url, body, {
            headers: { "Content-Type": "application/json" },
            timeout: 30000,
            validateStatus: null, // we classify every status ourselves
          })
          const latencyMs = Date.now() - t0

          if (resp.status === 200) {
            const raw = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text
            if (raw) {
              const finishReason = resp.data?.candidates?.[0]?.finishReason || "STOP"
              logAttempt({ label, key: keyNum, model, attempt, status: `ok (${finishReason})`, latencyMs })
              console.log(
                `[GEMINI-CALL] ${new Date().toISOString()} call=${label} success=true key_used=${keyNum} model_used=${model} ` +
                  `model_index=${modelIndex} attempts=${attempt} latency=${Date.now() - startedAt}ms prompt_chars=${prompt.length}`
              )
              geminiState.lastModelUsed = model
              geminiState.lastSuccessAt = new Date().toISOString()
              geminiState.consecutiveFailures = 0
              if (modelIndex > 0 || keyIndex > 0) geminiState.totalFallbacks += 1
              return cleanGeminiOutput(raw)
            }
            // 200 but no usable text — usually finishReason SAFETY/RECITATION.
            const finishReason =
              resp.data?.candidates?.[0]?.finishReason ||
              resp.data?.promptFeedback?.blockReason ||
              "EMPTY"
            logAttempt({ label, key: keyNum, model, attempt, status: "empty_candidate", error: finishReason, latencyMs })
            lastError = `empty candidate (${finishReason})`
            break // deterministic — move to the next model
          }

          if (resp.status === 429) {
            const q = classifyQuotaError(resp)
            if (q.daily) sawDailyQuota = true
            const waitMs = backoffMs(attempt, q.retryDelayMs)
            logAttempt({
              label,
              key: keyNum,
              model,
              attempt,
              status: "429",
              error: `${q.apiStatus || "RESOURCE_EXHAUSTED"}${q.daily ? " (daily quota)" : " (per-minute)"}`,
              latencyMs,
              retryInMs: attempt < ATTEMPTS_PER_MODEL ? waitMs : undefined,
            })
            lastError = `429 ${q.apiStatus || "RESOURCE_EXHAUSTED"}${q.daily ? " daily" : ""}`
            if (attempt < ATTEMPTS_PER_MODEL) {
              await sleep(waitMs)
              continue
            }
            break // next model — its quota bucket may be untouched
          }

          if (resp.status === 400 || resp.status === 403) {
            const bodyStr = JSON.stringify(resp.data || {})
            const apiStatus = resp.data?.error?.status || String(resp.status)
            logAttempt({ label, key: keyNum, model, attempt, status: String(resp.status), error: apiStatus, latencyMs })
            if (/API_KEY_INVALID|API_KEY_EXPIRED|PERMISSION_DENIED|API key not valid|API key expired/i.test(bodyStr)) {
              sawKeyRejection = true
              keyRejected = true
              geminiState.lastError = apiStatus
              geminiState.lastErrorKind = "AI_KEY_REJECTED"
              geminiState.lastFailureAt = new Date().toISOString()
              console.log(`[GEMINI] Key ${keyNum} rejected by Gemini API (${resp.status} ${apiStatus}).`)
              break // abort remaining models for this key
            }
            lastError = `${resp.status} ${apiStatus}`
            break // a bad request won't fix itself on retry — next model
          }

          // 5xx / anything else — transient, retry then move on
          logAttempt({
            label,
            key: keyNum,
            model,
            attempt,
            status: String(resp.status),
            error: resp.data?.error?.status || "server_error",
            latencyMs,
          })
          lastError = String(resp.status)
          if (attempt < ATTEMPTS_PER_MODEL) {
            await sleep(backoffMs(attempt))
            continue
          }
          break
        } catch (err) {
          if (err.code === "AI_KEY_REJECTED") throw err
          const latencyMs = Date.now() - t0
          if (err.code === "ECONNABORTED") {
            logAttempt({ label, key: keyNum, model, attempt, status: "timeout", error: "ECONNABORTED", latencyMs })
            lastError = "Request timed out"
            if (attempt < ATTEMPTS_PER_MODEL) {
              await sleep(1000)
              continue
            }
            break
          }
          logAttempt({ label, key: keyNum, model, attempt, status: "network_error", error: err.code || err.message, latencyMs })
          lastError = String(err.message || err)
          break
        }
      }
      if (keyRejected) break // skip remaining models if key was rejected
    }

    if (keyIndex < keys.length - 1) {
      console.log(`[GEMINI] Key ${keyNum} exhausted or rejected. Falling back to Key ${keyNum + 1}...`)
    }
  }

  if (sawKeyRejection && !sawDailyQuota) {
    geminiState.lastError = "AI_KEY_REJECTED"
    geminiState.lastErrorKind = "AI_KEY_REJECTED"
    geminiState.lastFailureAt = new Date().toISOString()
    geminiState.consecutiveFailures += 1
    throw Object.assign(
      new Error("Gemini rejected the API key(s). Fix GEMINI_API_KEY in backend-Node/.env and restart."),
      { code: "AI_KEY_REJECTED" }
    )
  }

  geminiState.lastError = String(lastError)
  geminiState.lastErrorKind = "GEMINI_ALL_EXHAUSTED"
  geminiState.lastFailureAt = new Date().toISOString()
  geminiState.consecutiveFailures += 1
  console.log(
    `[GEMINI-CALL] ${new Date().toISOString()} call=${label} success=false error_code=GEMINI_ALL_EXHAUSTED ` +
      `last_error="${lastError}" daily_quota=${sawDailyQuota} keys_tried=${keys.length} ` +
      `total_latency=${Date.now() - startedAt}ms prompt_chars=${prompt.length}`
  )
  throw Object.assign(new Error(`All Gemini models/keys exhausted. Last error: ${lastError}`), {
    code: "GEMINI_ALL_EXHAUSTED",
    dailyQuotaExceeded: sawDailyQuota,
    lastError: String(lastError),
  })
}

const getGeminiStatus = () => ({
  ...geminiState,
  modelChain: [...GEMINI_MODELS],
  attemptsPerModel: ATTEMPTS_PER_MODEL,
})

// ---------- Utilities ----------

/**
 * Exact port of clean_gemini_output():
 * strip markdown bold, emoji/bullet symbols, headers, list dashes,
 * then collapse multiple newlines.
 */
const cleanGeminiOutput = (text) => {
  let out = String(text ?? "")
  out = out.replace(/\*\*(.*?)\*\*/g, "$1")
  out = out.replace(/[*•📚⚠️💼✅🔹🔸📊🛠️📝⬇️🚀🔍]+/gu, "")
  out = out.replace(/#+\s?/g, "")
  out = out.replace(/[-–—]{1,3}\s?/g, "")
  out = out.replace(/\n{2,}/g, "\n\n")
  return out.trim()
}

export { callGeminiWithFallback, getGeminiStatus, getGeminiApiKeys, cleanGeminiOutput, GEMINI_MODELS }
