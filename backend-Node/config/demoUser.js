// Code-only demo login — works with or without MongoDB.
// Checked BEFORE the database lookup in authUser, and recognized by the
// auth middleware (no DB document exists for this id).
//
// NOTE: this is a demo/college-project convenience account, not a secure
// authentication factor. Do not ship real user data behind it.

export const DEMO_USER_ID = "demo-user-abc"
export const DEMO_EMAIL = "abc@gmail.com"
export const DEMO_PASSWORD = "ABC123"
export const DEMO_USER = {
  name: "Demo User",
  userType: "student", // logs in fine from both the Student and HR pages
}

export const isDemoCredentials = (email, password) =>
  String(email || "").trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD
