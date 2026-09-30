# HirePulse

AI-powered placement preparation platform. Brings resume/ATS analysis,
AI mock interviews, DSA practice, job recommendations and placement
dashboards into a single application, backed by one Node.js + Express
backend.

## Tech Stack
- **Frontend:** React + Vite, Tailwind CSS, Axios, React Router, Web
  Speech API, React Webcam
- **Backend:** Node.js + Express, Mongoose, JWT, bcrypt, Multer
- **Database:** MongoDB Atlas
- **AI:** Google Gemini API (called server-side only)
- **Job Data:** JSearch (RapidAPI)
- **Deployment:** Vercel (separate frontend and backend projects)

> Note: an earlier version of this project used a separate Python /
> FastAPI service for AI features. That has been consolidated into the
> single Node.js/Express backend described here — see
> `docs/ARCHITECTURE.md` and `docs/DECISIONS.md`.

## Features
- Authentication (student accounts) — JWT in HTTP-only cookie
- Student Dashboard
- Resume ATS Analyzer (PDF text extraction + OCR fallback + AI scoring)
- AI Mock Interview (speech-to-text -> Gemini -> text-to-speech)
- Job Recommendations (role + location)
- DSA Top 75 (curated, filterable problem list)

## Project Documentation
See `docs/`:
- `PRD.md` — what we're building and why
- `ARCHITECTURE.md` — how the system is built
- `DESIGN.md` — visual system and UX requirements
- `TASKS.md` — current task breakdown

## Getting Started

### Prerequisites
- Node.js LTS
- npm
- MongoDB Atlas connection string
- Google Gemini API key
- RapidAPI key (for job recommendations)

### Environment Variables
Copy `.env.example` to `.env` and fill in real values:
```
MONGO_URI=
JWT_SECRET=
GOOGLE_API_KEY=
RAPIDAPI_KEY=
FRONTEND_URL=
TESSDATA_CACHE_PATH=
```
Never commit real values — `.env.example` should stay the only file
tracked in Git.

### Install & Run
```
npm install
npm run dev
```

## Known Current Limitations
- Some student dashboard analytics are static/mock, not yet fully
  persisted per-user in MongoDB
- No CSRF protection and no general API rate limiter yet
- Webcam is used on the frontend only and is never sent to the backend
  or to Gemini
