# Product Requirements Document

## Product
HirePulse — AI-Powered Placement Preparation Platform

## Problem
Students currently use different, disconnected tools for different placement
activities: one tool for resume building, another for interview practice,
LeetCode-style sites for DSA prep, separate job portals for job search, and
no single place to track overall placement progress.

## Target Users
- Final-year and pre-final-year engineering/CS students preparing for
  campus and off-campus placements

## Goal
Bring resume preparation, interview practice, DSA preparation, job
discovery and progress tracking into a single platform, backed by one
Node.js/Express backend.

## Core Features
1. Authentication (student accounts)
2. Student Dashboard
3. Resume ATS Analyzer
4. AI Mock Interview
5. Job Recommendations
6. DSA Top 75

## MVP (must work end-to-end)
- Signup / Login (JWT in HTTP-only cookie, bcrypt password hashing)
- Student dashboard shell (resume score, interviews given, interview
  score, courses, calendar, tasks)
- Resume upload → PDF text extraction → OCR fallback → ATS scoring →
  feedback
- AI Mock Interview: speech-to-text → Gemini → text-to-speech
- Job Recommendations by role + location (via Job API)
- DSA Top 75 list with difficulty/topic filtering and LeetCode links

## Out of Scope (for current version)
- A fully persisted, real-time HR hiring workflow/backend (HR feature
  removed from scope)
- Full interview/resume history persisted per user in MongoDB
- Sending webcam video to any backend or AI service
- Python/FastAPI or any second backend service
- Payments, mobile app, gamification, social features

## Success Criteria
A user should be able to:
1. Create an account and log in as a student
2. Upload a resume and receive an ATS score with feedback
3. Complete a spoken AI mock interview and get a response
4. Search job recommendations by role and location
5. Browse and filter the DSA Top 75 list

## Known Current Gaps (be explicit about these — do not overclaim)
- Some student dashboard analytics are static/mock, not fully DB-backed
- No CSRF protection and no general API rate limiter yet

### Remember
PRD = WHAT + WHY
