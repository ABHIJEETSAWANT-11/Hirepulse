import express from "express"
import multer from "multer"
import os from "os"
import path from "path"
import rateLimit from "express-rate-limit"
import { protect } from "../middlewares/authMiddleware.js"
import { analyzeResume, getJobs, interviewChat, interviewReport, getInterviewStatus, getInterviewHistory } from "../controllers/aiController.js"

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "AI rate limit exceeded. Maximum 20 requests per 15 minutes." },
})

// Multipart handling for POST /analyze-resume/.
// Multer 2.x requires disk or memory storage to be explicit; we use
// diskStorage in the OS temp dir so large PDFs never sit fully in RAM,
// mirroring FastAPI's spooled UploadFile behavior. The controller deletes
// this file (and its own working copy) after every request.
const upload = multer({
  storage: multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req, file, cb) => {
      // unique per-request name; controller re-derives the original name
      cb(null, `upload-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname || "")}`)
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB guard
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || (file.originalname && file.originalname.toLowerCase().endsWith(".pdf"))) {
      cb(null, true)
    } else {
      cb(new Error("Only PDF files are allowed"))
    }
  },
})

const router = express.Router()

router.post("/analyze-resume/",  upload.single("file"), analyzeResume)
router.get("/job-recommendations", getJobs)
router.post("/interview/chat",  interviewChat)
router.post("/interview/report",   interviewReport)
router.get("/interview/status",   getInterviewStatus)
router.get("/interview/history",  getInterviewHistory)

export default router
