# Tasks

Work one task at a time: Understand -> Plan -> Implement -> Test ->
Review -> Commit -> next task.

## Phase 1: Setup
- [ ] Confirm single Node.js + Express backend (remove/retire any
      leftover Python/FastAPI code paths)
- [ ] Configure environment variables (MONGO_URI, JWT_SECRET,
      GOOGLE_API_KEY, RAPIDAPI_KEY, FRONTEND_URL, TESSDATA_CACHE_PATH)
- [ ] Configure MongoDB Atlas connection via Mongoose
- [ ] Configure CORS for the deployed frontend URL

## Phase 2: Authentication
- [ ] POST /api/users (signup, bcrypt hash)
- [ ] POST /api/users/auth (login, JWT in HTTP-only cookie)
- [ ] POST /api/users/logout
- [ ] GET/PUT /api/users/profile
- [ ] Auth middleware (verify JWT, attach user, protect routes)
- [ ] Test signup/login/logout flows, including invalid credentials

## Phase 3: Resume ATS Analyzer
- [ ] POST /analyze-resume/ endpoint with Multer upload
- [ ] PDF text extraction (pdf-parse)
- [ ] OCR fallback (Tesseract.js) when text extraction is insufficient
- [ ] ATS scoring logic (skills, sections, contact info, action verbs,
      quantified achievements, length, JD keyword match)
- [ ] Gemini-assisted feedback generation
- [ ] Frontend upload UI + score/feedback display
- [ ] Test with a text-based PDF and a scanned/image-based PDF

## Phase 4: AI Mock Interview
- [ ] POST /interview/chat (receives transcribed text, calls Gemini,
      returns next question/feedback)
- [ ] POST /interview/report, GET /interview/status
- [ ] Frontend: Speech Recognition capture -> send to backend
- [ ] Frontend: Speech Synthesis for AI responses
- [ ] Error handling for Gemini rate limits/unavailability (429/503)
- [ ] Test a full interview turn end-to-end

## Phase 5: Job Recommendations
- [ ] GET /job-recommendations (role + location params -> Job API call)
- [ ] Frontend: role/location input + results list
- [ ] Test with a couple of role/location combinations

## Phase 6: DSA Top 75
- [ ] Curated problem list (problem, difficulty, topic, LeetCode link)
- [ ] Client-side filtering by difficulty/topic
- [ ] Test filtering behavior

## Phase 7: Student Dashboard
- [ ] Wire resume score, interviews given, interview score to real data
      where available
- [ ] Clearly mark any still-static values (courses, calendar, tasks)
      as placeholder/mock in code comments
- [ ] Test dashboard renders correctly with a new/empty user

## Phase 8: Hardening
- [ ] Add basic API rate limiting
- [ ] Add CSRF protection
- [ ] Review error handling coverage (400/401/404/429/500/503)
- [ ] Review security checklist (secrets handling, auth coverage, input
      validation)

## Phase 9: Deployment
- [ ] Deploy frontend and backend as separate Vercel projects
- [ ] Configure production environment variables
- [ ] Smoke test the live URL (signup, login, resume upload, interview,
      job search, DSA list)
