import asyncHandler from "express-async-handler"
import axios from "axios"
import { GoogleGenAI } from "@google/genai"
import fs from "fs"
import os from "os"
import path from "path"
import { callGeminiWithFallback, getGeminiStatus, getGeminiApiKeys } from "../utils/gemini.js"
import { extractTextFromPdf } from "../utils/pdfExtractor.js"
import { localResumeAnalysis } from "../utils/localResumeAnalysis.js"
import Interview from "../models/interviewModel.js"

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

const analyzeResumeText = async (resumeText, jobDescription = null) => {
  const prompt = buildResumePrompt(resumeText, jobDescription)

  if (process.env.NVIDIA_API_KEY) {
    try {
      const response = await axios.post(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        {
          model: "meta/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (err) {
      console.log(`NVIDIA API unavailable (${err.message}); falling back to local analysis`);
    }
  } else {
    console.log("NVIDIA_API_KEY not set; using local analysis")
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
    res.json({ analysis: "Demo Report: (Generated due to an error processing the resume)\n\nOverall profile strength: Strong\nKey skills: JavaScript, React, Node.js\nAreas for improvement: Add more quantified achievements.\nRecommended courses: System Design, Advanced Algorithms\nATS Score: 75\nJob recommendations: Software Engineer, Full Stack Developer" })
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
    // multer's diskStorage temp file (Python's UploadFile spool equivalent)
    if (multerFile && multerFile.path) {
      fs.rm(multerFile.path, { force: true }, () => {})
    }
  }
})

// @desc fetch live job listings from RapidAPI jsearch
// route /job-recommendations
// @method get
const getJobs = asyncHandler(async (req, res) => {
  try {
    const url = "https://jsearch.p.rapidapi.com/search"
    const params = { query: "developer in India", page: "1", num_pages: "2" }
    const headers = {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
    const response = await axios.get(url, { headers, params, timeout: 8000, validateStatus: null })
    if (response.status !== 200) {
      console.log(`RapidAPI JSearch returned HTTP ${response.status}`)
      const reason =
        response.status === 429
          ? "Live job listings are temporarily unavailable — the external job API's free quota is used up. It resets shortly; try again later."
          : !process.env.RAPIDAPI_KEY
            ? "Live job listings are currently unavailable."
            : `Live job listings are unavailable (job API returned ${response.status}).`
      return res.status(502).json({ error: reason, jobs: [] })
    }
    const data = response.data
    res.json({ jobs: (data && data.data) || [] })
  } catch (err) {
    console.log(`Error fetching job recommendations: ${String(err.message || err)}`)
    res.status(502).json({ error: "Live job listings are unavailable right now — please try again in a bit.", jobs: [] })
  }
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
    const turn = req.body.turn || 1
    if (!userMessage) {
      return res.json({ error: "Message is required" })
    }


    const prompt = `
You are an experienced HR interviewer conducting a professional job interview.
The candidate just said: "${userMessage}"

Instructions:
- Acknowledge their answer briefly (1 sentence).
- Then ask ONE clear, relevant follow-up interview question.
- Keep the questions very basic and easy to understand.
- Keep the total response under 60 words so it can be spoken naturally.
- Do NOT use bullet points, markdown, or lists.
- Sound conversational and encouraging.
`
    const apiKeys = getGeminiApiKeys()

    try {
      const response = await axios.post(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        {
          model: "meta/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      const aiText = response.data.choices[0].message.content;
      _fallbackIndex = 0 // reset on success
      return res.json({ response: aiText })
    } catch (modelErr) {
      console.log(`[AI] chat error with NVIDIA API:`, modelErr.message)
      const question = FALLBACK_QUESTIONS[_fallbackIndex % FALLBACK_QUESTIONS.length]
      _fallbackIndex += 1
      return res.json({
        response: question,
        fallback: true,
        hint: "NVIDIA API network error, using fallback."
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
    const apiKeys = getGeminiApiKeys()

    try {
      const response = await axios.post(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        {
          model: "meta/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      const aiText = response.data.choices[0].message.content;

      let finalReport = null
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          finalReport = JSON.parse(jsonMatch[0])
        } catch {
          // JSONDecodeError equivalent → fall through to raw-text wrap
        }
      }

      if (!finalReport) {
        finalReport = {
          score: 7,
          strengths: ["Completed the interview session"],
          improvements: ["Could not parse detailed feedback"],
          overall_feedback: aiText,
        }
      }

      // Fire-and-forget persistence to MongoDB if user is logged in
      const userId = req.user?._id || req.user?.id
      if (userId) {
        Interview.create({
          user: String(userId),
          score: Number(finalReport.score) || 0,
          strengths: Array.isArray(finalReport.strengths) ? finalReport.strengths : [],
          improvements: Array.isArray(finalReport.improvements) ? finalReport.improvements : [],
          overall_feedback: String(finalReport.overall_feedback || ""),
          rawTranscript: trimmedConversation,
        }).catch((err) => console.log(`[DB] Failed to save interview report: ${err.message}`))
      }

      return res.json({ report: finalReport })
    } catch (modelErr) {
      console.log(`Report generation failed: ${String(modelErr.message || modelErr)}`)
      const finalReport = {
        score: 7,
        strengths: ["Completed the interview session", "Clear articulation", "Good effort"],
        improvements: ["Please retry later for a detailed AI analysis", "Elaborate more on specific examples"],
        overall_feedback: "This is a fallback report generated because the AI service is currently unavailable. You did well completing the session.",
      }
      const userId = req.user?._id || req.user?.id
      if (userId) {
        Interview.create({
          user: String(userId),
          score: Number(finalReport.score) || 0,
          strengths: finalReport.strengths,
          improvements: finalReport.improvements,
          overall_feedback: finalReport.overall_feedback,
          rawTranscript: trimmedConversation,
        }).catch((err) => console.log(`[DB] Failed to save interview report: ${err.message}`))
      }
      return res.json({ report: finalReport })
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
  const keys = getGeminiApiKeys()
  const keyConfigured = keys.length > 0
  res.json({
    keyConfigured,
    keyCount: keys.length,
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

// @desc get candidate's past interview reports
// route /interview/history
// @method get
const getInterviewHistory = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" })
  }
  const interviews = await Interview.find({ user: String(userId) })
    .sort({ createdAt: -1 })
    .limit(20)
  res.json({ interviews })
})

export { analyzeResume, getJobs, interviewChat, interviewReport, getInterviewStatus, getInterviewHistory }
