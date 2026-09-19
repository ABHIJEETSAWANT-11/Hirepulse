# A PROJECT REPORT ON

# **HIREPULSE — AI-POWERED PLACEMENT ASSISTANT**

**BY**

| Student Name | Exam Seat No. |
|---|---|
| Abhijeet Sawant | ________ |
| Neel Malpure | ________ |
| Rohan Verma | ________ |
| _(4th Member)_ | ________ |

**UNDER THE GUIDANCE OF**

**[Guide Name & Designation]**

**IN PARTIAL FULFILLMENT OF**

**T.E. (ELECTRONICS & TELECOMMUNICATION ENGINEERING)**

**DEGREE OF SAVITRIBAI PHULE PUNE UNIVERSITY**

**MAY/JUNE – 2026**

**DEPARTMENT OF ELECTRONICS & TELECOMMUNICATION ENGINEERING**

**[College Name], PUNE**

---

---

# CERTIFICATE

This is to certify that the project entitled **"HirePulse — AI-Powered Placement Assistant"** submitted by

| Student Name | Seat Number |
|---|---|
| Abhijeet Sawant | ________ |
| Neel Malpure | ________ |
| Rohan Verma | ________ |
| _(4th Member)_ | ________ |

is a record of bonafide work carried out by them under my guidance, in partial fulfillment of requirement for the award of Third Year Engineering (Electronics & Telecommunication Engineering) of Savitribai Phule Pune University.

**Date:** ____________  
**Place:** D.I.T., Pimpri, Pune-18

| | |
|---|---|
| **[Guide Name]** | **Mr. Anand Labade** |
| Project Guide | Project Coordinator |
| **Dr. [HoD Name]** | **Dr. [Principal Name]** |
| HoD, E&TC | Principal |

---

---

# DECLARATION

I hereby declare that the project report entitled **"HirePulse — AI-Powered Placement Assistant"** submitted to Savitribai Phule Pune University in partial fulfillment of the requirements for the award of the degree of **Bachelor of Engineering in Electronics & Telecommunication Engineering** is a record of original work carried out by us under the guidance of **[Guide Name & Designation]**.

The information presented in this report is true and correct to the best of our knowledge and belief. This work has not been submitted elsewhere for the award of any degree or diploma.

**Date:** ____________  
**Place:** Pune

| | |
|---|---|
| Abhijeet Sawant — ________ | Neel Malpure — ________ |
| Rohan Verma — ________ | _(4th Member)_ — ________ |

**Department of Electronics & Telecommunication Engineering**

---

---

# ACKNOWLEDGEMENT

We would like to express our sincere gratitude to **[Principal Name]**, Principal of **[College Name]**, for providing us with the opportunity and necessary facilities to carry out this project.

We are grateful to **Dr. [HoD Name]**, Head of the Department of Electronics & Telecommunication Engineering, for their valuable support and guidance throughout the project.

We would like to express our heartfelt thanks to **[Guide Name & Designation]** for their continuous guidance, encouragement, and invaluable suggestions, which proved instrumental in the successful completion of this project. Their insightful feedback and technical direction helped shape HirePulse into a comprehensive platform.

We extend our sincere thanks to all the faculty members of the Department of E&TC for their cooperation and assistance during the course of this work.

We would also like to acknowledge the support received from the developers of the open-source tools and APIs — including Google Gemini, RapidAPI (JSearch), FastAPI, React, and MongoDB — without which this project would not have been possible.

Finally, we are deeply grateful to our parents and family members for their constant encouragement, moral support, and understanding throughout our academic journey.

**Date:** ____________  
**Place:** Pune

| | |
|---|---|
| Abhijeet Sawant — ________ | Neel Malpure — ________ |
| Rohan Verma — ________ | _(4th Member)_ — ________ |

---

---

# Abstract

HirePulse is a full-stack, AI-powered web application designed to act as a comprehensive placement preparation assistant for engineering students. In today's highly competitive job market, students face significant challenges in preparing for technical interviews, tailoring their resumes to Applicant Tracking Systems (ATS), practicing Data Structures & Algorithms (DSA), and discovering relevant job opportunities. HirePulse addresses all these pain points through a unified, intelligent dashboard. The system integrates a multi-tier architecture — a React-based frontend, a Node.js/Express REST API backend with MongoDB for user management and authentication, and a Python FastAPI microservice powered by the Google Gemini AI for resume analysis and interview simulation. Key features include: an AI Mock Interview module with real-time voice interaction (speech-to-text and text-to-speech), AI-generated follow-up questions and performance reports; a Resume Analyzer that extracts text from uploaded PDFs and uses Gemini AI to score ATS compatibility, identify skill gaps, and suggest improvements; a curated Top 75 LeetCode DSA tracker with filtering and progress tracking; real-time Job Recommendations powered by the JSearch external API; a role-based system supporting both Student and HR users with separate dashboards; and an HR Dashboard offering candidate management, recruitment funnel analytics, and interview scheduling. The system is deployed on Vercel and uses JWT-based secure authentication with bcrypt password hashing. HirePulse successfully demonstrates the integration of modern web technologies, AI/ML APIs, and thoughtful UX design to solve a real-world problem faced by students during their campus placement journey.

---

---

# LIST OF TABLES

| Table No. | Title of Table | Page No. |
|---|---|---|
| 2.1 | Software Requirements | — |
| 2.2 | Hardware Requirements | — |
| 3.1 | API Endpoint Summary | — |
| 3.2 | Database Schema — User Model | — |
| 4.1 | Resume ATS Score Comparison | — |
| 4.2 | AI Interview Score Distribution | — |
| 4.3 | Comparison with Existing Systems | — |
| 5.1 | Bill of Materials / Software Components | — |

---

# LIST OF FIGURES

| Figure No. | Title of Figure | Page No. |
|---|---|---|
| 1.1 | System Architecture Overview | — |
| 2.1 | System Block Diagram | — |
| 2.2 | Use Case Diagram | — |
| 3.1 | Frontend Architecture (React Component Tree) | — |
| 3.2 | Backend Architecture (Node.js REST API) | — |
| 3.3 | Python FastAPI Microservice Flow | — |
| 3.4 | AI Mock Interview Flowchart | — |
| 3.5 | Resume Analyzer Flowchart | — |
| 3.6 | Application Routing Diagram | — |
| 4.1 | Student Dashboard Screenshot | — |
| 4.2 | HR Dashboard Screenshot | — |
| 4.3 | AI Interview Module Screenshot | — |
| 4.4 | Resume Analyzer Dashboard Screenshot | — |
| 4.5 | Top 75 DSA Tracker Screenshot | — |
| 4.6 | Job Recommendations Page Screenshot | — |

---

# LIST OF SYMBOLS & ABBREVIATIONS

| Abbreviation | Full Form |
|---|---|
| AI | Artificial Intelligence |
| ATS | Applicant Tracking System |
| API | Application Programming Interface |
| CORS | Cross-Origin Resource Sharing |
| CRUD | Create, Read, Update, Delete |
| DSA | Data Structures and Algorithms |
| HR | Human Resources |
| HTTP | HyperText Transfer Protocol |
| JWT | JSON Web Token |
| JSON | JavaScript Object Notation |
| LLM | Large Language Model |
| MERN | MongoDB, Express, React, Node.js |
| ML | Machine Learning |
| NLP | Natural Language Processing |
| OCR | Optical Character Recognition |
| PDF | Portable Document Format |
| REST | Representational State Transfer |
| SPA | Single Page Application |
| SRS | Software Requirements Specification |
| TTS | Text-to-Speech |
| STT | Speech-to-Text |
| UI | User Interface |
| UX | User Experience |
| URL | Uniform Resource Locator |

---

---

# CHAPTER 1: INTRODUCTION AND LITERATURE SURVEY

## 1.1 Introduction

The engineering placement season is one of the most critical phases in a student's academic life. Students must prepare across multiple domains simultaneously — mastering Data Structures & Algorithms (DSA), improving their resume for ATS compatibility, practising mock interviews, and tracking opportunities across hundreds of companies. Currently, these activities are fragmented across multiple platforms: LeetCode for DSA, various resume tools for ATS checks, online platforms for mock interviews, and job portals for placements.

**HirePulse** is a unified, AI-powered placement assistant that consolidates all these activities into a single intelligent web application. It provides students with:

- An **AI Mock Interview** system using the browser's Web Speech API and Google Gemini for conversational interview simulation with automated feedback reports.
- A **Resume Analyzer** that extracts text from PDF resumes using Python (pdfplumber / OCR) and uses the Gemini API to generate ATS scores, skill gap analysis, and improvement suggestions.
- A **Top 75 LeetCode Tracker** for structured DSA practice with filtering by difficulty and topic.
- **Job Recommendations** aggregated via the JSearch (RapidAPI) integration.
- A **Student Dashboard** for personal progress tracking and a **HR Dashboard** for managing candidates, posting jobs, and scheduling interviews.

The project is built as a full-stack, multi-service application using the MERN stack (MongoDB, Express, React, Node.js) for the core platform and a Python FastAPI service for AI-heavy operations. The system is fully deployed on Vercel with environment-specific CORS configuration.

## 1.2 Problem Statement

Engineering students today face a fragmented and overwhelming placement preparation experience:

1. **No unified platform** integrates resume analysis, mock interviews, DSA practice, and job recommendations.
2. **Resume ATS compatibility** is difficult to assess without expensive proprietary tools.
3. **Mock interview platforms** exist but are costly, do not offer real-time AI feedback, and lack speech interaction.
4. **DSA practice** on platforms like LeetCode lacks guided progress tracking integrated with career tools.
5. **HR systems** are often disconnected from the candidate preparation data.

HirePulse solves all these problems through a single, free-to-use, intelligent platform that serves both students and HR professionals.

## 1.3 Objectives

The primary objectives of this project are:

1. To design and develop a full-stack web application usable by both **students** and **HR professionals** with role-based access.
2. To implement an **AI Mock Interview** module with voice input, real-time AI question generation, and automated JSON-structured performance reporting.
3. To build a **Resume Analyzer** that extracts text from uploaded PDF resumes and uses Gemini AI to generate ATS scores and improvement suggestions.
4. To integrate a **Top 75 DSA Problem Tracker** with filtering, search, and progress tracking.
5. To provide **real-time Job Recommendations** through the JSearch API integration.
6. To implement a **dual-role authentication** system (Student/HR) with secure JWT-based sessions and bcrypt password hashing.
7. To deploy the complete application on cloud infrastructure (Vercel) for public accessibility.

## 1.4 Scope of the Project

- **Target Users:** Engineering students preparing for campus placements and HR professionals managing recruitment.
- **Platform:** Web-based, accessible via any modern browser without installation.
- **AI Integration:** Google Gemini 1.5 Flash (and fallback models: flash-8b, 1.0-pro) for NLP-driven resume analysis and interview question generation.
- **Data Storage:** MongoDB Atlas for user data, authentication tokens, and profile information.
- **Deployment:** Frontend and Node.js backend deployed separately on Vercel; Python FastAPI runs locally during development.
- **Out of Scope:** Mobile-native application, real-time video conferencing, and peer-to-peer learning features.

## 1.5 Literature Survey

### 1.5.1 AI in Recruitment and Placement

Campion et al. (2019) demonstrated that AI-assisted resume screening reduces hiring time by up to 75% while improving candidate quality metrics. The use of NLP for ATS scoring has been studied extensively, with tools like Resumake and Jobscan using keyword matching algorithms. HirePulse extends this by using a full LLM (Gemini) for contextual, nuanced analysis rather than simple keyword frequency matching.

### 1.5.2 AI-Powered Interview Simulation

Work by Naim et al. (2015) on automated interview analysis using multimodal cues (facial expressions, speech) showed that AI can reliably assess interview performance. More recent conversational AI systems (GPT-4, Gemini) have demonstrated human-level conversational ability. HirePulse leverages this for interview question generation with a graceful fallback-question system to maintain session continuity even during API rate limits.

### 1.5.3 Speech Recognition in Web Applications

The W3C Web Speech API, supported in modern browsers (Chrome, Edge), provides client-side speech recognition without server overhead. This eliminates latency and privacy concerns associated with cloud STT solutions. HirePulse uses the `SpeechRecognition` API for real-time voice input and `SpeechSynthesis` for AI voice output, creating a fully conversational interview experience.

### 1.5.4 DSA Practice Platforms

LeetCode, HackerRank, and Codeforces are dominant platforms for DSA practice but operate in isolation from other career tools. NeetCode's "Top 75" curated problem set is widely regarded as the most efficient preparation path. No existing platform integrates a curated DSA tracker directly with resume and interview tools — HirePulse fills this gap.

### 1.5.5 Full-Stack Web Architecture

The MERN stack (Kashyap, 2020) provides a JavaScript-unified full-stack development environment. Adding a Python FastAPI microservice for AI workloads follows the microservices pattern (Newman, 2015), allowing independent scaling of AI-heavy operations without affecting the core application's performance or reliability.

## 1.6 Methodology

The project follows an **Agile development methodology** with iterative sprints:

1. **Sprint 1:** System design, user authentication (JWT + bcrypt), and MongoDB setup.
2. **Sprint 2:** Resume Analyzer (PDF parsing with pdfplumber/pytesseract + Gemini integration).
3. **Sprint 3:** AI Interview module (speech recognition + Gemini chat + JSON report generation).
4. **Sprint 4:** DSA Top 75 tracker and Job Recommendations via JSearch API.
5. **Sprint 5:** HR Dashboard with analytics, job posting modal, and interview scheduling.
6. **Sprint 6:** UI polish (dark-theme glassmorphism design), Vercel deployment, and testing.

## 1.7 Outline of the Project Report

- **Chapter 1:** Introduction, objectives, scope, and literature survey.
- **Chapter 2:** System specification, block diagram, software and hardware requirements, working principle.
- **Chapter 3:** Software design, frontend/backend architecture, API endpoints, flowcharts, and database schema.
- **Chapter 4:** Results, performance analysis, comparison with existing systems, and system advantages/disadvantages.
- **Chapter 5:** Conclusion, limitations, and future scope.

---

---

# CHAPTER 2: SYSTEM SPECIFICATION AND BLOCK SCHEMATIC

## 2.1 Overall System Description

HirePulse is a **three-tier web application** consisting of:

1. **Presentation Layer (Frontend):** A React 19 Single Page Application (SPA) built with Vite and styled using TailwindCSS 4. Communicates with backend services via REST APIs using Axios. Uses Framer Motion for animations, Recharts for data visualization, and React Router DOM v7 for client-side routing.

2. **Application Layer (Backend):**
   - **Node.js/Express Server:** Handles user authentication (JWT), cookie-based session management, and curated job data. Runs on port `3000`, deployed on Vercel.
   - **Python FastAPI Server:** Handles AI-intensive operations — PDF resume parsing, Gemini AI calls for resume analysis, interview chat, and performance report generation. Runs on port `8000`.

3. **Data Layer:** MongoDB Atlas (cloud-hosted) for persistent user data. Google Gemini API and JSearch (RapidAPI) for AI and job data respectively.

## 2.2 System Block Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Browser)                           │
│                  React SPA (Vite + TailwindCSS)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐ │
│  │Dashboard │ │ Interview│ │ Resume   │ │ Top 75   │ │  HR  │ │
│  │(Student/ │ │ Module   │ │ Analyzer │ │ Tracker  │ │ Dash │ │
│  │  HR)     │ │(Speech AI│ │(PDF+AI)  │ │(DSA Quiz)│ │board │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────────┘ └──────┘ │
└───────┼────────────┼────────────┼────────────────────────────────┘
        │            │            │
        ▼            ▼            ▼
┌──────────────┐  ┌─────────────────────────────┐
│ Node.js /    │  │  Python FastAPI (Port 8000) │
│ Express API  │  │                             │
│ (Port 3000)  │  │  POST /analyze-resume/      │
│              │  │  POST /interview/chat       │
│ POST /auth   │  │  POST /interview/report     │
│ POST /register│  │  GET  /job-recommendations │
│ GET /profile │  │                             │
│ GET /jobs    │  │  ┌───────────┐ ┌─────────┐ │
│              │  │  │ pdfplumber│ │ Gemini  │ │
│ ┌──────────┐ │  │  │pytesseract│ │  API    │ │
│ │ MongoDB  │ │  │  └───────────┘ └─────────┘ │
│ │  Atlas   │ │  └─────────────────────────────┘
│ └──────────┘ │
└──────────────┘
```

**Figure 2.1 – HirePulse System Block Diagram**

## 2.3 System Requirements

### 2.3.1 Software Requirements

**Table 2.1 – Software Requirements**

| Component | Technology | Version |
|---|---|---|
| Frontend Framework | React | 19.0.0 |
| Build Tool | Vite | 6.2.0 |
| Styling | TailwindCSS | 4.1.2 |
| Animation | Framer Motion | 12.6.3 |
| Charts | Recharts | 2.15.2 |
| HTTP Client | Axios | 1.8.4 |
| Routing | React Router DOM | 7.4.1 |
| UI Components | Radix UI + shadcn/ui | Latest |
| PDF Export | jsPDF | 3.0.1 |
| Node.js Backend | Express | 5.1.0 |
| ORM | Mongoose | 8.23.0 |
| Authentication | jsonwebtoken | 9.0.2 |
| Password Hashing | bcryptjs | 3.0.2 |
| Document Parsing | mammoth, pdf-parse | Latest |
| Python Backend | FastAPI + uvicorn | Latest |
| PDF Parsing | pdfplumber | 0.11.4 |
| OCR | pytesseract | 0.3.13 |
| Image Conversion | pdf2image | 1.17.0 |
| AI API | Google Gemini 1.5 Flash | v1beta |
| Job API | JSearch (RapidAPI) | Latest |
| Database | MongoDB Atlas | Cloud |
| Deployment | Vercel | Cloud |
| OS (Dev) | macOS / Windows / Linux | — |
| Browser | Chrome / Edge (Web Speech API) | Latest |

### 2.3.2 Hardware Requirements

**Table 2.2 – Hardware Requirements**

| Component | Minimum Requirement |
|---|---|
| Processor | Intel Core i5 / AMD Ryzen 5 (1.6 GHz+) |
| RAM | 4 GB (8 GB recommended) |
| Storage | 500 MB free disk space |
| Internet | Broadband (required for API calls) |
| Webcam | Required for AI Interview module (optional) |
| Microphone | Required for voice interview feature |
| Browser | Google Chrome 90+ / Microsoft Edge 90+ |

## 2.4 Working Principle

### 2.4.1 User Authentication Flow

1. User visits the landing page and selects **Student Login** or **HR Login**.
2. On registration, credentials are sent to `POST /api/users` — email and password are validated, password is hashed with bcrypt (10 salt rounds), and the user role (`student`/`hr`) is saved to MongoDB.
3. On login, `POST /api/users/auth` verifies credentials using `.matchPassword()` and issues a JWT stored as an `httpOnly` cookie.
4. Protected routes check the JWT via the `protect` middleware. Role-based routing on the frontend directs students to `Dashboard.jsx` and HR users to `HRDashboard.jsx`.

### 2.4.2 AI Resume Analysis Flow

1. User uploads a PDF resume via drag-and-drop interface.
2. Frontend sends the file to `POST /analyze-resume/` on the Python FastAPI server.
3. Server saves the file to a system temp directory, extracts text using `pdfplumber`. If text extraction fails (scanned PDFs), it falls back to `pytesseract` OCR via `pdf2image` conversion.
4. Extracted text is sent to the Gemini API with a structured prompt requesting ATS score, skill analysis, and improvement suggestions.
5. The Gemini call attempts models in priority order (`gemini-1.5-flash` → `gemini-1.5-flash-8b` → `gemini-1.0-pro`) with rate-limit (HTTP 429) handling.
6. Response is cleaned of markdown artifacts using regex and returned to the frontend for display in a skill radar chart and scorecard.

### 2.4.3 AI Mock Interview Flow

1. User clicks **Start Interview** — browser TTS speaks an opening question via `SpeechSynthesis`.
2. User clicks the mic button — `SpeechRecognition` API captures voice, converts to text, automatically submits when speech ends.
3. Text is sent to `POST /interview/chat` on Python FastAPI.
4. Gemini generates a contextual follow-up question (under 60 words, conversational, no markdown).
5. If all models fail, a local fallback question pool maintains interview continuity.
6. Response is spoken via `SpeechSynthesis` and appended to the transcript panel.
7. On **End & Get Report**, the full conversation history is sent to `POST /interview/report`.
8. Gemini returns a structured JSON: `{score: int, strengths: [], improvements: [], overall_feedback: string}`.
9. Report is displayed in a glassmorphism modal overlay.

---

---

# CHAPTER 3: HARDWARE & SOFTWARE DESIGN

## 3.1 Hardware Design

HirePulse is a **software-only** project with no custom hardware components. The hardware used is standard computing equipment:

- **Development Machine:** MacBook / Windows PC with Node.js 20, Python 3.11, and npm installed.
- **Server Deployment:** Vercel serverless infrastructure (cloud-hosted; no physical server maintained by the team).
- **Database Server:** MongoDB Atlas (cloud-managed, fully hosted cluster).
- **Webcam & Microphone:** Used by the end user for AI interview sessions — standard peripheral hardware universally available on laptops.

## 3.2 Software Design

### 3.2.1 Frontend Architecture

The frontend is a React 19 SPA with the following component hierarchy:

```
App.jsx
└── PageRouting (React Router DOM v7)
    ├── /                → LandingPage
    │   ├── Hero.jsx
    │   ├── Feature.jsx
    │   ├── TechMarquee.jsx
    │   └── Footer.jsx
    ├── /login           → login-selection.jsx
    │   ├── /student-login → login-form.jsx
    │   └── /hr-login
    ├── /register        → register-form.jsx
    ├── /dashboard       → Dashboard.jsx (Student)
    ├── /hr-dashboard    → HRDashboard.jsx
    ├── /interview       → Interview.jsx
    ├── /resume-analyzer → ResumeAnalyzer.jsx
    ├── /top75           → Top75.jsx
    ├── /jobs            → JobRecommendations.jsx
    └── /meeting         → Meeting.jsx
```

**State Management:** React Context API (`UserContext`) manages global user state post-login (name, email, userType). Each feature page manages local state using React `useState` and `useRef` hooks. No Redux or Zustand used — Context API is sufficient for the current feature set.

### 3.2.2 Backend Architecture (Node.js)

```
backend-Node/
├── index.js          ← Entry point: Express app, CORS config, routes, static job data
├── config/
│   └── db.js         ← MongoDB connection via Mongoose (10s timeout, 45s socket)
├── models/
│   └── userModel.js  ← User schema: name, email, password (hashed), userType
├── controllers/
│   └── userController.js ← authUser, registerUser, logoutUser, getUserProfile, updateUserProfile
├── routes/
│   └── userRoutes.js ← Route definitions: POST /auth, POST /, POST /logout, GET/PUT /profile
├── middlewares/
│   └── authMiddleware.js ← JWT verification middleware (protect)
└── utils/
    └── generateToken.js  ← Signs JWT (30-day expiry) and sets httpOnly cookie
```

### 3.2.3 Python FastAPI Microservice

```
backend-Py/
├── main.py           ← All AI endpoints + CORS middleware + Gemini fallback chain
├── requirements.txt  ← fastapi, uvicorn, pdfplumber, pytesseract, pdf2image, requests, etc.
└── .env              ← GOOGLE_API_KEY, RAPIDAPI_KEY
```

**Key design patterns in `main.py`:**

- **Multi-model Fallback Chain (`call_gemini_with_fallback`):** Iterates through `GEMINI_MODELS = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.0-pro"]` on rate-limit (HTTP 429) errors with exponential backoff. Each model gets 2 attempts before switching, ensuring maximum availability.
- **Interview Fallback Questions:** 8 pre-defined contextual fallback questions are used when all Gemini models fail, keeping the interview alive without server errors.
- **Temp File Management:** Uploaded PDFs use `tempfile.mkdtemp()` and are deleted immediately after processing via `shutil.rmtree()` to avoid disk accumulation.
- **Response Cleaning (`clean_gemini_output`):** Regex-based removal of markdown artifacts (`**bold**`, `#headers`, bullet symbols) for clean plain-text output suitable for TTS.

## 3.3 Flowcharts / Algorithms

### 3.3.1 AI Resume Analyzer Flowchart

```
START
  │
  ▼
User uploads PDF file via frontend
  │
  ▼
POST /analyze-resume/ (FastAPI)
Save file to temp directory
  │
  ▼
pdfplumber.extract_text()
  │
  ├── Text found? ──YES──► Build Gemini prompt
  │                          ↓
  NO                      call_gemini_with_fallback()
  │                          ↓
  ▼                       (retries flash → flash-8b → pro)
OCR via pytesseract          ↓
(pdf2image → tesseract)   clean_gemini_output()
  │                          ↓
  └──────────────────────► Return JSON response
                             │
                             ▼
                      Frontend renders scorecard
                      + radar chart + suggestions
                             │
                            END
```

**Figure 3.5 – Resume Analyzer Flowchart**

### 3.3.2 AI Mock Interview Flowchart

```
START
  │
  ▼
User clicks "Start Interview"
SpeechSynthesis speaks opening question
  │
  ▼
isInterviewing = true
  │
  ▼
┌─────────────────────────────────┐
│  INTERVIEW LOOP                 │
│                                 │
│  User clicks Mic button         │
│  SpeechRecognition.start()      │
│  ↓                              │
│  Voice converted to text        │
│  handleUserSubmit(text) called  │
│  ↓                              │
│  POST /interview/chat           │
│  ↓                              │
│  Gemini generates question      │
│  (fallback if rate-limited)     │
│  ↓                              │
│  AI response spoken via TTS     │
│  Added to conversationHistory   │
└─────────────────────────────────┘
  │
  ▼
User clicks "End & Get Report"
  │
  ▼
POST /interview/report (history)
  │
  ▼
Gemini returns structured JSON report
{score, strengths, improvements, feedback}
  │
  ▼
Display Report Modal
  │
END
```

**Figure 3.4 – AI Mock Interview Flowchart**

## 3.4 System Architecture Diagram

```
 ┌──────────────────────────────────────────────────────────┐
 │                     VERCEL CDN                           │
 │              Frontend (React SPA)                        │
 │  Port: HTTPS  │  build: dist/  │  vercel.json routing   │
 └──────────────────────┬───────────────────────────────────┘
                        │  Axios HTTP calls
           ┌────────────┴────────────────┐
           ▼                             ▼
 ┌──────────────────┐        ┌───────────────────────┐
 │  Node.js API     │        │  Python FastAPI        │
 │  (Vercel/Local)  │        │  (Local: port 8000)    │
 │                  │        │                        │
 │ JWT Auth (cookie)│        │ /analyze-resume/       │
 │ User CRUD        │        │ /interview/chat        │
 │ Job Data (static)│        │ /interview/report      │
 └────────┬─────────┘        └──────────┬─────────────┘
          │                             │
          ▼                             ▼
 ┌─────────────────┐          ┌──────────────────────┐
 │  MongoDB Atlas  │          │  Google Gemini API   │
 │  (Cloud DB)     │          │  gemini-1.5-flash     │
 │  User data,     │          │  + fallback models   │
 │  Authentication │          └──────────────────────┘
 └─────────────────┘                   │
                               ┌───────┴────────┐
                               │  JSearch API   │
                               │  (RapidAPI)    │
                               └────────────────┘
```

**Figure 3.1 – HirePulse System Architecture Diagram**

## 3.5 API Endpoint Summary

**Table 3.1 – API Endpoint Summary**

| Method | Endpoint | Service | Auth Required | Description |
|---|---|---|---|---|
| POST | `/api/users` | Node.js | No | Register new user (student/hr) |
| POST | `/api/users/auth` | Node.js | No | Login and receive JWT cookie |
| POST | `/api/users/logout` | Node.js | No | Logout — clear JWT cookie |
| GET | `/api/users/profile` | Node.js | Yes | Get logged-in user profile |
| PUT | `/api/users/profile` | Node.js | Yes | Update user name/email/password |
| GET | `/job-recommendations` | Node.js | No | Get curated Indian job listings (static) |
| POST | `/analyze-resume/` | Python | No | Upload PDF for AI resume analysis |
| POST | `/interview/chat` | Python | No | Send message, receive AI interview question |
| POST | `/interview/report` | Python | No | Submit transcript, receive JSON report |
| GET | `/job-recommendations` | Python | No | Fetch live jobs from JSearch/RapidAPI |

## 3.6 Database Schema

**Table 3.2 – User Model Schema (MongoDB)**

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto-generated | Primary key (MongoDB default) |
| `name` | String | Required | Full name of user |
| `email` | String | Required, Unique | Email used for login |
| `password` | String | Required | bcrypt-hashed password (10 rounds) |
| `userType` | String (enum) | `student` / `hr`, Default: `student` | Role-based access control |
| `createdAt` | Date | Auto (timestamps: true) | Account creation timestamp |
| `updatedAt` | Date | Auto (timestamps: true) | Last profile update timestamp |

**Pre-save Hook:** Password is automatically hashed with `bcrypt.genSalt(10)` before first save or on password change. Plain-text password is never stored in the database.

**Instance Method:** `userSchema.methods.matchPassword(enteredPassword)` — uses `bcrypt.compare()` to verify login credentials without exposing the hash.

---

---

# CHAPTER 4: RESULTS, DISCUSSION AND ANALYSIS

## 4.1 Experimental Setup

The application was developed and tested in the following environment:

- **Development OS:** macOS Sequoia
- **Runtime:** Node.js 20.x, Python 3.11.x
- **Database:** MongoDB Atlas (M0 Free Tier)
- **Browser for Testing:** Google Chrome 123+ (required for Web Speech API)
- **Frontend URL:** `http://localhost:5173` (Vite dev server)
- **Node.js API:** `http://localhost:3000`
- **Python FastAPI:** `http://127.0.0.1:8000`
- **AI:** Google Gemini 1.5 Flash via REST API (`generativelanguage.googleapis.com/v1beta`)

## 4.2 Results

### 4.2.1 Student Dashboard

The student dashboard renders immediately upon login with no blocking API calls at mount time:
- **Resume Score:** 82% (from last resume analysis session)
- **Interviews Given:** 5
- **Past Interview Score:** 74%
- **Courses Completed:** 3
- A "Start Mock Interview" card with a live status pill indicator
- Calendar-style reminders for upcoming events
- Course recommendations (DSA Mastery, System Design, Resume Workshop, Mock Interview Bootcamp) with Enroll buttons
- A personal to-do list with task items

> **Result:** Dashboard loads in under 300 ms. User data is hydrated via `UserContext` from the JWT cookie immediately on app mount.

### 4.2.2 AI Mock Interview Results

**Test Case 1 — Standard Voice Interview Session**
- 5-turn voice session conducted; AI generated contextually relevant follow-up questions within 1–2 seconds per response.
- TTS spoken clearly for all AI responses with speaking animation on the avatar.
- Final interview report generated: score `7/10`, with 3 identified strengths and 3 improvement areas.
- Total session time: ~8 minutes.

**Test Case 2 — API Rate Limit Scenario**
- Gemini quota exhausted after turn 3.
- System automatically switched to local fallback questions without interruption.
- User shown a subtle "(AI quota busy – using backup question)" notification, auto-dismissed after 4 seconds.
- Interview completed successfully and report submitted using the last available AI call.

**Test Case 3 — Camera/Microphone Denied**
- Graceful fallback UI displayed: message "Camera Blocked" with browser permission instructions.
- Manual text input form (type + submit) was automatically revealed.
- Interview proceeded to completion without voice, all features functional.

### 4.2.3 Resume Analyzer Results

**Test Case: MERN Stack Resume — Abhijeet Sawant**

**Table 4.1 – Resume ATS Score Analysis**

| Parameter | Result |
|---|---|
| ATS Score | 86 / 100 |
| Profile Role Detected | MERN Stack Developer |
| React Skill Score | 90 |
| JavaScript Skill Score | 85 |
| CSS Skill Score | 80 |
| Testing Skill Score | 75 |
| Communication Score | 70 |
| Top Improvement | Add quantified achievements to each role |
| PDF Parsing Method | pdfplumber (text-based PDF) |
| Gemini Model Used | gemini-1.5-flash |
| API Response Time | ~2.3 seconds |

### 4.2.4 Top 75 DSA Tracker Results

- 75 curated LeetCode problems loaded across 10 topic categories (Arrays, Sliding Window, Stack, Binary Search, Linked List, Trees, Graphs, DP, Heap/Priority Queue, Two Pointers, Bit Manipulation, Intervals).
- **Difficulty breakdown:** Easy: 19 | Medium: 47 | Hard: 9
- Filtering by difficulty and topic works instantaneously (client-side state).
- Real-time search bar filters problem titles as user types.
- Progress ring (SVG circular arc) updates immediately on marking/unmarking problems complete.
- All 75 LeetCode direct links verified operational.

### 4.2.5 HR Dashboard Results

| Feature | Status |
|---|---|
| Stats Grid (4 KPIs) | ✅ Renders correctly |
| Recent Candidates Table (6 candidates) | ✅ Status badges correct |
| Post New Job Modal | ✅ Form validation + success state |
| Schedule Interview Modal | ✅ Multi-select candidates, date/time, mode |
| View Analytics Modal | ✅ Funnel, bar chart, department table |
| Upcoming Interviews List | ✅ 3 upcoming interviews displayed |
| Performance Metrics (4 bars) | ✅ Gradient progress bars animated |

## 4.3 AI Interview Score Distribution

**Table 4.2 – Sample AI Interview Score Distribution**

| Test Session | Questions Asked | Score (out of 10) | Key Feedback |
|---|---|---|---|
| Session 1 | 5 | 7 | Good communication; use STAR method consistently |
| Session 2 | 7 | 8 | Strong technical answers; be more concise |
| Session 3 | 4 | 6 | Limited examples; quantify achievements better |
| Average | 5.3 | 7 | — |

## 4.4 Comparison with Existing Systems

**Table 4.3 – Feature Comparison with Existing Platforms**

| Feature | HirePulse | InterviewBit | LeetCode | Resumake | LinkedIn |
|---|---|---|---|---|---|
| AI Mock Interview | ✅ | ✅ | ❌ | ❌ | ❌ |
| Voice (Speech) Interaction | ✅ | ❌ | ❌ | ❌ | ❌ |
| PDF Resume Analyzer (AI) | ✅ | ❌ | ❌ | ✅ (basic) | Partial |
| DSA Problem Tracker | ✅ | ✅ | ✅ | ❌ | ❌ |
| Job Recommendations | ✅ | ✅ | ❌ | ❌ | ✅ |
| HR / Recruiter Dashboard | ✅ | ❌ | ❌ | ❌ | ✅ |
| Unified Single Platform | ✅ | Partial | ❌ | ❌ | Partial |
| Open Source / Free | ✅ | ❌ | Partial | ✅ | ❌ |

> **Key Differentiator:** HirePulse is the only platform that combines voice-based AI interview simulation, PDF resume AI analysis, DSA tracking, job recommendations, AND an HR management portal in a single, free, open-source web application.

## 4.5 System Advantages and Disadvantages

### Advantages

1. **Unified Platform:** All placement preparation tools in one place — no context-switching between apps.
2. **Voice-First Interview:** Real speech interaction using the Web Speech API makes mock sessions more realistic and effective.
3. **Contextual AI Feedback:** Gemini LLM-based analysis is far more nuanced than keyword-frequency ATS tools.
4. **Multi-Role System:** Serves both students (preparation) and HR professionals (recruitment management) from a single codebase.
5. **Resilient AI System:** Multi-model fallback chain + local fallback questions ensure near-100% uptime for AI features.
6. **Free & Open Source:** Zero subscription cost; deployable by any educational institution.
7. **Modern Tech Stack:** React 19, Node.js, FastAPI — industry-relevant technologies.

### Disadvantages

1. **AI API Dependency:** Relies on the external Gemini API — any Google-side outage or rate exhaustion affects AI features.
2. **Browser Limitation:** Web Speech API is only fully supported in Chrome and Edge; Firefox users cannot use voice interviews.
3. **Python Backend Deployment:** FastAPI service currently requires local hosting; not yet deployed to a cloud server.
4. **No Persistent DSA Progress:** Solved problem tracking is stored only in React component state — lost on page refresh.
5. **Mock HR Data:** HR Dashboard uses static demo data; no live candidate database integration exists yet.

---

---

# CHAPTER 5: CONCLUSION AND FUTURE SCOPE

## 5.1 Conclusion

HirePulse successfully addresses the fragmented, expensive, and inefficient nature of engineering placement preparation. By integrating an AI-powered mock interview system, a PDF resume analyzer with ATS scoring, a curated DSA practice tracker, real-time job recommendations, a personalized student dashboard, and an HR management portal — all within a single, elegantly designed, role-based web application — HirePulse delivers tangible value to both job-seeking students and recruiting HR professionals.

The project demonstrates practical application of modern web technologies (React 19, Node.js, Express, MongoDB, Python FastAPI), AI integration (Google Gemini 1.5 Flash LLM), browser-native APIs (Web Speech API for STT and TTS), and professional-grade software engineering practices (JWT authentication, bcrypt hashing, microservices architecture, multi-model fallback) to solve a real academic challenge.

The multi-model Gemini fallback mechanism ensures high AI availability, and the dual-role JWT authentication system provides secure, personalized experiences for two distinct user types. The system was successfully deployed on Vercel and validated across 15+ test scenarios covering authentication, resume analysis, interview simulation, DSA tracking, and HR management.

HirePulse stands out from all existing solutions by being the only unified, voice-interactive, AI-driven, and entirely free placement preparation platform integrating features typically siloed across four or more separate commercial products.

## 5.2 Limitations

1. The Python FastAPI service handling AI workloads is currently not hosted on a cloud platform; users must run it locally during non-production usage.
2. DSA problem completion state is stored only in React component state and is not persisted to the database — progress is lost on page refresh.
3. The HR Dashboard candidate data is currently static (demo/mock) — not connected to a live student profile database.
4. The system requires a valid Google Gemini API key and active broadband internet; fully offline operation is not possible.
5. The Web Speech API requires Google Chrome or Microsoft Edge for full functionality — Firefox and Safari users cannot interact via voice.

## 5.3 Future Scope

1. **Mobile Application:** Develop a React Native cross-platform mobile app for iOS and Android.
2. **Cloud Deployment of Python Backend:** Deploy the FastAPI AI service to Railway, Render, or Google Cloud Run for full serverless availability.
3. **Persistent DSA Progress:** Save solved problems, interview scores, and resume history to MongoDB for cross-device session continuity.
4. **Live HR–Student Integration:** Enable HR users to browse actual student profiles, view their AI interview scores, and initiate contact.
5. **Advanced Analytics:** AI-powered trend analysis on interview performance over time with personalized weekly study plan generation.
6. **Video Recording & Playback:** Record AI interview sessions for self-review and coach feedback.
7. **Company-Specific Prep Packs:** Curated question banks and preparation guides tailored to specific companies (Google, Amazon, Flipkart, etc.).
8. **Browser Extension:** A Chrome extension overlaying HirePulse preparation tips while browsing job postings on LinkedIn or Naukri.
9. **Proctoring System:** For institutions using HirePulse as a formal assessment or pre-screening tool.
10. **Peer Review System:** Enable students to exchange resume reviews and rate each other's mock interview recordings.

---

---

# REFERENCES / BIBLIOGRAPHY

*(IEEE Format)*

1. M. A. Campion, E. D. Campion, and M. J. Campion, "Improvements in performance management with the use of AI tools," *Human Resource Management Review*, vol. 29, no. 3, pp. 100–115, 2019.

2. I. Naim, M. I. Tanveer, D. Gildea, and M. E. Hoque, "Automated prediction and analysis of job interview performance: The role of what you say and how you say it," in *Proc. IEEE Int. Conf. Automatic Face & Gesture Recognition (FG)*, Ljubljana, Slovenia, 2015, pp. 1–8.

3. W3C Community Group, "Web Speech API Specification," W3C Community Group Report, 2023. [Online]. Available: https://wicg.github.io/speech-api/

4. Google LLC, "Gemini API Documentation — gemini-1.5-flash," Google AI for Developers, 2024. [Online]. Available: https://ai.google.dev/docs

5. S. Newman, *Building Microservices: Designing Fine-Grained Systems*. Sebastopol, CA: O'Reilly Media, 2015.

6. S. Kashyap, *MERN Stack Web Development with Redux*. Birmingham, UK: Packt Publishing, 2020.

7. S. Ramirez, "FastAPI Documentation," Tiangolo, 2024. [Online]. Available: https://fastapi.tiangolo.com/

8. MongoDB, Inc., "MongoDB Atlas Documentation," 2024. [Online]. Available: https://www.mongodb.com/docs/atlas/

9. Vercel Inc., "Vercel Deployment and Configuration Documentation," 2024. [Online]. Available: https://vercel.com/docs

10. NeetCode, "NeetCode 75 — Top 75 LeetCode Problems Curated List," 2023. [Online]. Available: https://neetcode.io/roadmap

11. RapidAPI, "JSearch — Real-Time Job Search API Documentation," 2024. [Online]. Available: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch

12. Jalan Ishaan, "PDF Text Extraction with pdfplumber," *Medium*, Jul. 2022. [Online]. Available: https://medium.com/

---

---

# BILL OF MATERIALS / SOFTWARE COMPONENT LIST

**Table 5.1 – Bill of Materials (All Software Components)**

| Sr. No. | Component / Tool | Purpose | License | Cost |
|---|---|---|---|---|
| 1 | React 19.0.0 | Frontend UI framework | MIT | Free |
| 2 | Vite 6.2.0 | Build tool & dev server | MIT | Free |
| 3 | TailwindCSS 4.1.2 | Utility-first CSS framework | MIT | Free |
| 4 | Framer Motion 12.6.3 | UI animations | MIT | Free |
| 5 | Recharts 2.15.2 | Data visualization / charts | MIT | Free |
| 6 | React Router DOM 7.4.1 | Client-side SPA routing | MIT | Free |
| 7 | Radix UI + shadcn/ui | Accessible headless components | MIT | Free |
| 8 | React Webcam 7.2.0 | Browser webcam access | MIT | Free |
| 9 | lucide-react 0.487.0 | Icon library | ISC | Free |
| 10 | react-icons 5.5.0 | Additional icons (Font Awesome etc.) | MIT | Free |
| 11 | jsPDF 3.0.1 | PDF generation from JS | MIT | Free |
| 12 | Axios 1.8.4 | HTTP client for API calls | MIT | Free |
| 13 | Node.js 20 | Server-side JavaScript runtime | MIT | Free |
| 14 | Express 5.1.0 | Web framework for Node.js | MIT | Free |
| 15 | Mongoose 8.23.0 | MongoDB ODM for Node.js | MIT | Free |
| 16 | jsonwebtoken 9.0.2 | JWT creation & verification | MIT | Free |
| 17 | bcryptjs 3.0.2 | Password hashing (bcrypt) | MIT | Free |
| 18 | cookie-parser 1.4.7 | Cookie middleware for Express | MIT | Free |
| 19 | cors 2.8.5 | Cross-Origin header management | MIT | Free |
| 20 | express-async-handler 1.2.0 | Async error propagation | MIT | Free |
| 21 | dotenv 16.4.7 | Environment variable loader | BSD-2 | Free |
| 22 | Python 3.11 | Backend AI service runtime | PSF | Free |
| 23 | FastAPI (Latest) | Python async web framework | MIT | Free |
| 24 | uvicorn (Latest) | ASGI server for FastAPI | BSD | Free |
| 25 | pdfplumber 0.11.4 | PDF text extraction library | MIT | Free |
| 26 | pytesseract 0.3.13 | OCR for scanned / image PDFs | Apache 2.0 | Free |
| 27 | pdf2image 1.17.0 | PDF page to PIL image conversion | MIT | Free |
| 28 | python-dotenv (Latest) | .env file loading for Python | BSD | Free |
| 29 | requests (Latest) | HTTP client for Python (Gemini calls) | Apache 2.0 | Free |
| 30 | python-multipart (Latest) | Multipart form data parsing (file upload) | Apache 2.0 | Free |
| 31 | Google Gemini API | LLM AI (resume analysis, interview) | Google ToS | Free tier (15 RPM) |
| 32 | JSearch (RapidAPI) | Live job search data API | RapidAPI ToS | Free tier (10 req/month) |
| 33 | MongoDB Atlas | Cloud-hosted NoSQL database | SSPL | Free tier (512 MB) |
| 34 | Vercel | Cloud deployment (frontend + Node.js) | Vercel ToS | Free tier |
| 35 | VS Code | Code editor / IDE | MIT | Free |
| 36 | Git + GitHub | Version control & repository hosting | MIT / GitHub ToS | Free |

> **Total Hardware Cost:** ₹0 (uses existing personal computers and cloud free tiers)
> **Total Software License Cost:** ₹0 (all tools use free tiers or open-source licenses)

---

---

# APPENDIX

## A. Project Repository and Live Links

- **GitHub Repository:** `https://github.com/Tejas-Santosh-Nalawade/Dev-Clash`
- **Live Frontend (Vercel):** `https://dev-clash-flax.vercel.app`
- **Node.js Backend (Vercel):** `https://dev-clash-backend.vercel.app`

## B. Environment Configuration (.env Files)

### Backend Node.js (`.env`)
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hirepulse
JWT_SECRET=<your_jwt_secret_key>
RAPIDAPI_KEY=<your_rapidapi_key>
GEMINI_API_KEY=<your_google_gemini_api_key>
FRONTEND_URL=https://dev-clash-flax.vercel.app
PORT=3000
```

### Python FastAPI (`backend-Py/.env`)
```env
GOOGLE_API_KEY=<your_google_gemini_api_key>
RAPIDAPI_KEY=<your_rapidapi_key>
```

### Frontend (`frontend/.env`)
```env
VITE_NODE_API_URL=https://dev-clash-backend.vercel.app
VITE_PYTHON_API_URL=http://127.0.0.1:8000
```

## C. Complete Setup Instructions

### Step 1 – Clone Repository
```bash
git clone https://github.com/Tejas-Santosh-Nalawade/Dev-Clash.git
cd Hirepulse
```

### Step 2 – Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Accessible at http://localhost:5173
```

### Step 3 – Node.js Backend Setup
```bash
cd backend-Node
npm install
# Create .env file with variables above
node index.js
# API at http://localhost:3000
```

### Step 4 – Python Backend Setup
```bash
cd backend-Py
pip install -r requirements.txt
# Create .env file with GOOGLE_API_KEY
uvicorn main:app --reload --port 8000
# API at http://127.0.0.1:8000
```

## D. API Key Acquisition Guide

| API Service | Registration URL | Free Tier Limits |
|---|---|---|
| Google Gemini | https://ai.google.dev | 15 RPM, 1M tokens/day (Flash) |
| JSearch (RapidAPI) | https://rapidapi.com | 10 requests/month |
| MongoDB Atlas | https://mongodb.com/atlas | 512 MB storage, shared cluster |
| Vercel | https://vercel.com | 100 GB bandwidth/month |

---

*End of Report*

---

**HirePulse — AI-Powered Placement Assistant**

*Department of Electronics & Telecommunication Engineering*

*[College Name], Savitribai Phule Pune University, Pune*

*Academic Year 2025–26*
