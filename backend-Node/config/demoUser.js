// Code-only demo accounts — work with or without MongoDB.
// Checked BEFORE the database lookup in authUser, and recognized by the
// auth middleware (no DB documents exist for these ids). Login still issues
// a real JWT cookie so protected routes work; nothing is persisted.
//
// NOTE: these are demo/college-project convenience accounts, not a secure
// authentication factor. Do not ship real user data behind them.

export const DEMO_ACCOUNTS = [
  {
    id: "demo-user-abc",
    email: "abc@gmail.com",
    password: "ABC123456",
    name: "Abhijeet Sawant",
    userType: "student",
    accountType: "demo",
    profileData: {
      resumeScore: 86,
      mockCount: 5,
      skillBreakdown: {
        react: 90,
        javascript: 85,
        css: 80,
        testing: 78,
        communication: 82,
      },
      pastMetrics: {
        resumeScore: 82,
        mockCount: 3,
        pastInterviewScore: 78,
        coursesCompleted: 2,
      },
      jobMatches: [
        { title: "Frontend Engineer", location: "Bengaluru", match: 94 },
        { title: "Backend Developer", location: "Pune", match: 88 },
      ],
      interviews: [
        { id: "int-1", company: "Amazon", type: "Technical round", date: "Mon Feb 7, 10:00 AM", score: 82 },
        { id: "int-2", company: "Google", type: "Behavioral", date: "Tue Feb 8, 5:00 PM", score: 79 },
      ],
    },
  },
  {
    id: "demo-user-abhi",
    email: "abhi@gmail.com",
    password: "ABHI123456",
    name: "Abhijeet S.",
    userType: "student",
    accountType: "demo",
    profileData: {
      resumeScore: 88,
      mockCount: 8,
      skillBreakdown: {
        react: 92,
        javascript: 88,
        css: 85,
        testing: 82,
        communication: 85,
      },
      pastMetrics: {
        resumeScore: 85,
        mockCount: 6,
        pastInterviewScore: 79,
        coursesCompleted: 3,
      },
      jobMatches: [
        { title: "Senior Frontend Engineer", location: "Bangalore", match: 96 },
        { title: "Full Stack Engineer", location: "Pune", match: 92 },
      ],
      interviews: [
        { id: "int-1", company: "Microsoft", type: "Technical round", date: "Wed Feb 9, 11:00 AM", score: 85 },
        { id: "int-2", company: "Apple", type: "System Design", date: "Thu Feb 10, 4:00 PM", score: 81 },
      ],
    },
  },
]

// Back-compat aliases (older code referenced the single demo account)
export const DEMO_USER_ID = DEMO_ACCOUNTS[0].id
export const DEMO_EMAIL = DEMO_ACCOUNTS[0].email
export const DEMO_PASSWORD = DEMO_ACCOUNTS[0].password
export const DEMO_USER = { name: DEMO_ACCOUNTS[0].name, userType: DEMO_ACCOUNTS[0].userType }

export const findDemoAccount = (email, password) => {
  const normalized = String(email || "").trim().toLowerCase()
  return DEMO_ACCOUNTS.find((acc) => acc.email === normalized && acc.password === password)
}

export const isDemoCredentials = (email, password) => !!findDemoAccount(email, password)
