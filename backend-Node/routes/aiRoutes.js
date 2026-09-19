import express from "express"
import multer from "multer"
import os from "os"
import path from "path"
import { analyzeResume, getJobs, interviewChat, interviewReport, getInterviewStatus } from "../controllers/aiController.js"

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
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB guard — FastAPI had no explicit limit, but serverless bodies cap ~4.5 MB anyway
})

const router = express.Router()

router.post("/analyze-resume/", upload.single("file"), analyzeResume)
router.get("/job-recommendations", getJobs)
router.post("/interview/chat", interviewChat)
router.post("/interview/report", interviewReport)
router.get("/interview/status", getInterviewStatus)

export default router
