import asyncHandler from "express-async-handler"
import axios from "axios"
import fs from "fs"
import os from "os"
import path from "path"
import { callGeminiWithFallback, getGeminiStatus } from "../utils/gemini.js"
import { extractTextFromPdf } from "../utils/pdfExtractor.js"
import { localResumeAnalysis } from "../utils/localResumeAnalysis.js"

// ---------- Resume Analysis ----------

const buildResumePrompt = (resumeText, jobDescription) => {
  let prompt = `
Assume you are a professional resume analyst and career coach.
Analyze the following resume and provide a report including:
- Overall profile strength
- Key skills
- Areas for improvement
- Recommended courses
- ATS Score (between 0 and 100)
- Job recommendations

Give brief and concise answers.

Resume:
${resumeText}
`
  if (jobDescription) {
    prompt += `\n\nCompare with this job description:\n${jobDescription}`
  }
  return prompt
}

// Port of analyze_resume_text(): Gemini when configured, local offline
// analysis when the key is missing or all models are exhausted.
const analyzeResumeText = async (resumeText, jobDescription = null) => {
  const prompt = buildResumePrompt(resumeText, jobDescription)

  const apiKey = process.env.GOOGLE_API_KEY
  if (apiKey) {
    try {
      return await callGeminiWithFallback(prompt, apiKey)
    } catch (err) {
      console.log(`Gemini unavailable (${err.message}); falling back to local analysis`)
    }
  } else {
    console.log("GOOGLE_API_KEY not set; using local analysis")
  }
  return localResumeAnalysis(resumeText, jobDescription)
}

// @desc analyze uploaded resume PDF (+ optional job description)
// route /analyze-resume/
// @method post
// Matches main.py: always 200 — {"analysis": ...} on success,
// {"error": "Failed to analyze resume: ..."} on any failure,
// temp dir removed in both paths (shutil.rmtree equivalent).
const analyzeResume = asyncHandler(async (req, res) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hirepulse-resume-"))
  let multerFile = null
  try {
    if (!req.file) {
      // FastAPI would answer 422 for a missing required file; we keep the
      // route's always-200 {"error": ...} contract instead.
      throw new Error("No file uploaded (multipart form field 'file' is required)")
    }
    multerFile = req.file

    // Mirror Python's tempfile.mkdtemp() + shutil.copyfileobj(): work on a
    // copy inside our own temp dir. basename() guards against path
    // traversal via a crafted upload filename.
    const originalName = path.basename(req.file.originalname || "resume.pdf")
    const filePath = path.join(tempDir, originalName)
    fs.copyFileSync(req.file.path, filePath)

    console.log(`Processing file: ${originalName}`)
    const resumeText = await extractTextFromPdf(filePath)

    if (!resumeText) {
      throw new Error("Failed to extract text from PDF")
    }

    console.log(`Extracted text length: ${resumeText.length}`)
    const jobDescription = (req.body && req.body.job_description) || ""
    const analysis = await analyzeResumeText(resumeText, jobDescription)
    res.json({ analysis })
  } catch (err) {
    console.log(`Error analyzing resume: ${String(err.message || err)}`)
    res.json({ error: `Failed to analyze resume: ${String(err.message || err)}` })
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
    // multer's diskStorage temp file (Python's UploadFile spool equivalent)
    if (multerFile && multerFile.path) {
      fs.rm(multerFile.path, { force: true }, () => {})
    }
  }
})

// ---------- Job Recommendations ----------

// @desc fetch live job listings from RapidAPI jsearch
// route /job-recommendations
// @method get
// Port of get_jobs(): no error handling in Python either — a failed call
// surfaces as a 500, same as FastAPI.
const getJobs = asyncHandler(async (req, res) => {
  const url = "https://jsearch.p.rapidapi.com/search"
  const params = { query: "developer in India", page: "1", num_pages: "2" }
  const headers = {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  }
  // validateStatus: null → never throw on HTTP error statuses, matching
  // requests.get() semantics in main.py
  const response = await axios.get(url, { headers, params, validateStatus: null })
  const data = response.data
  res.json({ jobs: (data && data.data) || [] })
})

// ---------- Interview Chat ----------

// Contextual follow-up fallback questions (used when AI is unavailable)
const FALLBACK_QUESTIONS = [
  "That's interesting! Can you walk me through a challenging project you've worked on recently?",
  "Great answer. How do you handle pressure or tight deadlines in your work?",
  "Good. Can you describe a time when you had to learn a new technology quickly?",
  "Tell me about a situation where you disagreed with a team member — how did you handle it?",
  "What are your key strengths that make you a great fit for this role?",
  "Where do you see yourself professionally in the next 3 years?",
  "Can you give an example of how you've improved a process or workflow?",
  "How do you stay updated with the latest trends in your field?",
]
let _fallbackIndex = 0

// @desc HR interviewer chat turn
// route /interview/chat
// @method post
const interviewChat = asyncHandler(async (req, res) => {
  try {
    const userMessage = (req.body && req.body.message) || ""
    if (!userMessage) {
      return res.json({ error: "Message is required" })
    }

    const prompt = `
You are an experienced HR interviewer conducting a professional job interview.
The candidate just said: "${userMessage}"

Instructions:
- Acknowledge their answer briefly (1 sentence).
- Then ask ONE clear, relevant follow-up interview question.
- Keep the total response under 60 words so it can be spoken naturally.
- Do NOT use bullet points, markdown, or lists.
- Sound conversational and encouraging.
`
    const apiKey = process.env.GOOGLE_API_KEY

    try {
      const aiText = await callGeminiWithFallback(prompt, apiKey, { label: "interview-chat" })
      _fallbackIndex = 0 // reset on success
      return res.json({ response: aiText })
    } catch (modelErr) {
      const kind = modelErr.code || "UNKNOWN"

      // Missing/rejected key: every model would fail identically, and a
      // scripted "backup question" would hide the misconfiguration. Fail loudly.
      if (kind === "AI_KEY_MISSING" || kind === "AI_KEY_REJECTED") {
        console.log(`[AI] chat unavailable (${kind})`)
        return res.status(503).json({
          error:
            kind === "AI_KEY_MISSING"
              ? "AI service is not configured: GOOGLE_API_KEY is missing in backend-Node/.env."
              : "AI service rejected the API key. Fix GOOGLE_API_KEY in backend-Node/.env and restart the backend.",
          code: kind,
          retryable: false,
        })
      }

      // All models exhausted (usually quota) → use a local fallback question
      // so the interview keeps going instead of crashing or losing progress.
      console.log(`All models failed, using fallback question: ${String(modelErr.message || modelErr)}`)
      const question = FALLBACK_QUESTIONS[_fallbackIndex % FALLBACK_QUESTIONS.length]
      _fallbackIndex += 1
      return res.json({
        response: question,
        fallback: true,
        code: kind,
        dailyQuotaExceeded: !!modelErr.dailyQuotaExceeded,
        retryAfterSeconds: modelErr.dailyQuotaExceeded ? 60 : 15,
        hint: modelErr.dailyQuotaExceeded
          ? "Daily Gemini quota is used up; it resets at midnight Pacific time. Backup questions keep the interview going."
          : "Gemini is rate-limited right now; retry in a few seconds. Backup questions keep the interview going.",
      })
    }
  } catch (err) {
    console.log(`Error in interview chat: ${String(err.message || err)}`)
    return res.json({
      response: "I'm having a brief connectivity issue. Please repeat your answer or type it below.",
      error: String(err.message || err),
    })
  }
})

// ---------- Interview Report ----------

// @desc structured interview feedback from full conversation
// route /interview/report
// @method post
const interviewReport = asyncHandler(async (req, res) => {
  try {
    const conversation = (req.body && req.body.conversation) || ""
    if (!conversation) {
      return res.json({ error: "Conversation history is required" })
    }

    // Keep the prompt lean: a full verbatim transcript inflates input tokens
    // (burns the per-minute TPM quota faster) without improving feedback quality.
    const MAX_CONVERSATION_CHARS = 4000
    const trimmedConversation =
      conversation.length > MAX_CONVERSATION_CHARS
        ? `${conversation.slice(0, MAX_CONVERSATION_CHARS)}\n[... earlier transcript trimmed ...]`
        : conversation

    const prompt = `
You are an expert Interview Coach.
Analyze the following interview conversation and provide structured feedback.

Conversation:
${trimmedConversation}

Return ONLY valid JSON (no markdown, no backticks) with exactly these fields:
{
  "score": <integer 0-10>,
  "strengths": [<string>, ...],
  "improvements": [<string>, ...],
  "overall_feedback": "<string>"
}
`
    const apiKey = process.env.GOOGLE_API_KEY

    try {
      const aiText = await callGeminiWithFallback(prompt, apiKey, { label: "interview-report" })

      // Extract JSON from response — same greedy first-{ to last-} match
      // with dotall behavior as main.py's re.search(r"\{.*\}", ai_text, re.DOTALL);
      // Gemini doesn't always return clean JSON.
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          return res.json({ report: JSON.parse(jsonMatch[0]) })
        } catch {
          // JSONDecodeError equivalent → fall through to raw-text wrap
        }
      }

      // Fallback: wrap raw text
      return res.json({
        report: {
          score: 7,
          strengths: ["Completed the interview session"],
          improvements: ["Could not parse detailed feedback"],
          overall_feedback: aiText,
        },
      })
    } catch (modelErr) {
      const kind = modelErr.code || "UNKNOWN"
      console.log(`Report generation failed (${kind}): ${String(modelErr.message || modelErr)}`)

      // Missing/rejected key: a placeholder "7/10" report would be actively
      // misleading. Fail loudly instead of silently grading the interview.
      if (kind === "AI_KEY_MISSING" || kind === "AI_KEY_REJECTED") {
        return res.status(503).json({
          error:
            kind === "AI_KEY_MISSING"
              ? "AI report unavailable: GOOGLE_API_KEY is missing in backend-Node/.env."
              : "AI report unavailable: Gemini rejected the API key. Fix GOOGLE_API_KEY in backend-Node/.env and restart the backend.",
          code: kind,
          retryable: false,
        })
      }

      // Quota exhausted on every model → clear user-facing error; the frontend
      // keeps the conversation so the user can retry without losing progress.
      return res.status(503).json({
        error: modelErr.dailyQuotaExceeded
          ? "AI service is temporarily busy — today's free quota is used up and resets at midnight Pacific time. Your conversation is saved; please try the report again in a minute."
          : "AI service is temporarily busy, please try again in a minute.",
        code: kind,
        retryable: true,
        dailyQuotaExceeded: !!modelErr.dailyQuotaExceeded,
      })
    }
  } catch (err) {
    console.log(`Error generating report: ${String(err.message || err)}`)
    return res.json({
      report: {
        score: 6,
        strengths: ["Participated in the interview"],
        improvements: ["Please retry for a detailed AI analysis"],
        overall_feedback: `Report generation encountered an error: ${String(err.message || err)}`,
      },
    })
  }
})

// @desc live status of the Gemini fallback chain (which model served last,
// last error kind, call counters) — for the frontend banner / debugging
// route /interview/status
// @method get
const getInterviewStatus = (req, res) => {
  const s = getGeminiStatus()
  const keyConfigured = !!process.env.GOOGLE_API_KEY
  res.json({
    keyConfigured,
    lastModelUsed: s.lastModelUsed,
    lastSuccessAt: s.lastSuccessAt,
    lastFailureAt: s.lastFailureAt,
    lastError: s.lastError,
    lastErrorKind: s.lastErrorKind,
    consecutiveFailures: s.consecutiveFailures,
    totalCalls: s.totalCalls,
    totalFallbacks: s.totalFallbacks,
    modelChain: s.modelChain,
    attemptsPerModel: s.attemptsPerModel,
    aiAvailable: keyConfigured && s.lastErrorKind !== "AI_KEY_REJECTED",
  })
}

export { analyzeResume, getJobs, interviewChat, interviewReport, getInterviewStatus }
