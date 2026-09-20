# Port notes: backend-Py (FastAPI) → backend-Node (Express)

**backend-Py/ was deleted on 2026-09-19.** All four routes from `backend-Py/main.py` are ported and live in this backend. This document is kept as the historical record of the migration. Items marked ⚠️ are places where Node behavior can
plausibly differ from the Python original.

## File mapping

| Concern | Python (`main.py`) | Node |
|---|---|---|
| Gemini fallback chain + output cleaning | `call_gemini_with_fallback`, `clean_gemini_output` | `utils/gemini.js` |
| PDF text extraction + OCR fallback | `extract_text_from_pdf` (pdfplumber + pdf2image/pytesseract) | `utils/pdfText.js` (pdf-parse + tesseract.js) |
| Offline resume analysis | `local_resume_analysis` | `utils/localResumeAnalysis.js` |
| 4 routes | `@app.post /analyze-resume/`, `@app.get /job-recommendations`, `@app.post /interview/chat`, `@app.post /interview/report` | `controllers/aiController.js`, mounted in `routes/aiRoutes.js` (paths unchanged) |
| Multipart upload | FastAPI `UploadFile` (spooled to disk) | multer `diskStorage` in OS tmpdir, cleaned up per-request |

## ⚠️ Behavior differences to review

1. **Text extraction engine.** pdfplumber → pdf.js (via pdf-parse v2). Word/line
   ordering, hyphenation and spacing on complex layouts (columns, tables,
   non-Latin glyphs) can differ slightly; the ATS keyword logic is robust to
   this, but AI output for the same PDF is not guaranteed to be identical.
2. **OCR engine.** tesseract.js (WASM) replaces native pytesseract — slightly
   weaker/slower on noisy scans. Chosen because you deploy to Vercel
   serverless, where the native `tesseract` binary can't be packaged.
   Traineddata (~5 MB) is downloaded once to the OS temp dir
   (`TESSDATA_CACHE_PATH` to override) — cold OCR adds a one-time download.
3. **Model-failure timing.** Python counts 2 attempts *per model* but 429 also
   advances models; on timeout it retries the same model once. The port
   matches this exactly, but axios adds no internal retries and connection
   errors (DNS refused etc.) skip to the next model after one attempt — same
   as Python's `except Exception` branch. Total worst-case latency ≈
   3 models × 2 attempts × 30 s timeout + sleeps ≈ up to ~3 min, identical
   to Python but verify your frontend/host timeouts tolerate it (Vercel caps
   functions at 10 s–60 s depending on plan — a 30 s Gemini timeout can hit
   the platform ceiling before the fallback chain finishes).
4. **429 handling — superseded 2026-09-19.** The port originally matched Python's
   1 s / 1.5 s sleeps. The fallback chain was since rewritten to be quota-aware:
   429s are classified (per-minute vs daily via QuotaFailure details), retried
   with exponential backoff per model (1s, 2s… capped 8s, `GEMINI_ATTEMPTS_PER_MODEL`
   to tune), invalid-key errors abort the chain immediately (fatal for every
   model), and every attempt is logged as a `[GEMINI]`/`[GEMINI-CALL]` line.
5. **Upload size limit.** FastAPI had no explicit limit (bound by the
   platform); multer is capped at 15 MB. Oversized uploads return HTTP 413
   (`LIMIT_FILE_SIZE`) via the global error handler instead of a 200 body.
6. **Filename handling.** Python used `file.filename` verbatim as the temp
   filename (path-traversal risk); the port uses `path.basename()` — same
   visible behavior, hardened.
7. **Gemini response edge case.** If `candidates[0].content.parts` were empty,
   Python raised `TypeError` → outer except → 200 error body; the port
   raises TypeError inside the axios `try`, producing "All Gemini models
   exhausted. Last error: …" paths — net response shape identical, message
   wording may differ slightly.
8. **JSON body parsing.** Python's `request: dict` returns `{}` for any
   non-dict JSON (e.g. a bare string) and for missing body; Express's
   `express.json()` errors on malformed JSON with HTTP 400, and a JSON body
   that is not an object yields `req.body` string → `(req.body && req.body.message)`
   is undefined → same "Message is required"/"Conversation history is required"
   bodies. Malformed-JSON requests now get 400 instead of 422/200.
9. **Unicode normalization.** Python `str.strip()` and JS `.trim()` agree on
   the common whitespace set; exotic Unicode spaces (U+00A0, U+2028) strip in
   JS but not in Python's `.strip()` for the final `.trim()` — practical
   impact negligible, cosmetic only.
10. **Process model.** FastAPI ran single-process with a module-global
    `_fallbackIndex`; on Vercel each Node invocation may be a fresh isolate,
    so the fallback-question rotation can restart from question 1 more often
    than in the long-running Python process. Same code, weaker continuity.
11. **Concurrent OCR.** tesseract.js workers are created per request
    (Python did the same with pytesseract calls). Under concurrent scanned
    uploads, memory spikes (rendering + WASM) are higher than native
    tesseract; serverless concurrency also multiplies traineddata downloads
    until the /tmp cache is warm per instance.
12. **`X-RapidAPI-Key` unset.** Identical to Python: the header is sent as
    `undefined`-stringified/omitted, RapidAPI returns 401/403 JSON whose
    `.data` is absent → `{ jobs: [] }` with HTTP 200 (verified live).

## Verified in this port

- Endpoint paths unchanged: `/analyze-resume/`, `/job-recommendations`,
  `/interview/chat`, `/interview/report` (frontend keeps working; it already
  pointed all Python-bound calls at `VITE_API_URL_PYTHON` — all now point at
  `VITE_API_URL_NODE` (done).
- Success and all fallback bodies byte-compared against `main.py`
  (placeholder report, fallback-question rotation, offline analysis).
- Empty-input error bodies: `{"error": "Message is required"}` etc. — exact.
- `cleanGeminiOutput` parity tests vs Python regex semantics (incl. the
  `.strip()` interior-space nuance) — pass.
- Gemini model chain re-verified against
  https://ai.google.dev/gemini-api/docs/models on 2026-09-18:
  `gemini-2.5-flash` ✅ stable, `gemini-2.5-flash-lite` ✅ stable
  (docs flag shutdown 2026-10-16 — first to die), `gemini-3.1-flash-lite` ✅
  stable (only the `-preview` variant is shut down).
- 2026-09-20: user's new key gets 404 NOT_FOUND on `gemini-2.5-flash` /
  `-lite` generateContent, so the chain now uses rolling aliases verified
  live with 200s: `gemini-flash-latest` → `gemini-flash-lite-latest` →
  `gemini-3.1-flash-lite`.
- OCR fallback verified end-to-end (text-less PDF → rasterize → OCR → text).
- Temp-dir cleanup runs on success, error, and multer-spill paths.
- CORS: Node's existing `allowedOrigins` behavior untouched; Python's
  `allow_origins=["*"]` was NOT ported (deliberate, per requirements).
