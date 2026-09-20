import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()
const PORT = process.env.PORT || 3000
import connectDB from "./config/db.js"

if (process.env.MONGO_URI) {
  // Top-level await (ESM): we try to connect before serving. connectDB() no
  // longer exits on failure — it logs a checklist and returns null, and the
  // server starts anyway so the code-only demo login keeps working. DB-backed
  // routes will fail per-request (global handler returns 500s) until the
  // connection succeeds.
  await connectDB();
} else {
  console.log("⚠️ MongoDB not configured. Starting server without database.");
}

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json())

app.use(cookieParser())

app.use("/api/users", userRoutes)

// AI routes ported from backend-Py/main.py (analyze-resume, job-recommendations,
// interview chat + report) — see controllers/aiController.js
app.use(aiRoutes)

// Global error handler — converts thrown errors into JSON responses
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log("Server listening on port: " + PORT)
})
