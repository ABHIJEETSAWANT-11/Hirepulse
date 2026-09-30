# Architecture

## Frontend
React + Vite
Tailwind CSS
Axios
React Router
Web Speech API (speech recognition + synthesis)
React Webcam (frontend display only — never sent to backend)

## Backend
Node.js + Express (single backend — no Python/FastAPI, no separate AI
microservice)
Mongoose (MongoDB ODM)
JWT (auth tokens)
bcrypt (password hashing)
Multer (file upload handling)
Axios (outbound HTTP to Gemini / Job API)

## Database
MongoDB Atlas, accessed via Mongoose

## AI
Google Gemini API — always called from the Node/Express backend, never
directly from the React frontend, so the API key stays server-side.

## Job Data
External Job API (JSearch via RapidAPI)

## High-Level Flow
```
User
 |
 v
React + Vite (Axios)
 |
 v
Node.js + Express  <-- single backend
 |
 |---- MongoDB Atlas (Mongoose)
 |---- Gemini API
 |---- Job API (JSearch/RapidAPI)
 |
 v
Response -> React UI
```

## Feature Flows

### Authentication
```
Register: React -> POST /api/users -> validate -> bcrypt hash -> MongoDB
Login:    React -> POST /api/users/auth -> find user -> compare password
          -> generate JWT -> set HTTP-only cookie
```

### AI Mock Interview
```
Student speaks -> browser Speech Recognition -> text
  -> POST /interview/chat -> Express -> Gemini API
  -> next question / feedback -> Express -> React
  -> browser Speech Synthesis -> spoken to student
```
Webcam is used on the frontend for display only; video is not sent to
the backend or to Gemini.

### Resume ATS Analyzer
```
Upload PDF -> React -> Express -> Multer -> pdf-parse text extraction
  -> if extraction fails, Tesseract.js OCR fallback
  -> extracted text -> Gemini / rule-based ATS scoring
  -> score + feedback -> React
```

### Job Recommendations
```
React -> GET /job-recommendations?role=&location= -> Express
  -> Job API (JSearch/RapidAPI) -> results -> React
```

## Folder Structure (backend)
```
src/
  routes/
  controllers/
  services/
  models/
  middleware/
  config/
```

## Architectural Rules
- UI components must not contain database or Gemini-call logic.
- All database operations live in services, not controllers or routes.
- Authentication/authorization is verified server-side only, via
  middleware, never trusted from the client.
- Gemini and Job API calls happen only in the backend.
- Reusable UI goes in shared components; business logic stays out of UI.

## Migration Note (old vs final)
**Old:** React -> Node/Express -> MongoDB, and separately React ->
Python/FastAPI -> Gemini (two backends).

**Final:** React -> single Node/Express backend -> MongoDB + Gemini +
Job API.

Reason for consolidation: most of the app was already JavaScript-based;
removing the second service cut inter-service network hops, simplified
deployment, and reduced architectural complexity.

### Remember
ARCHITECTURE.md = HOW
