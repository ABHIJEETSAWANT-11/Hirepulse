// Demo accounts — pure frontend convenience data.
// These NEVER touch MongoDB: the AuthContext checks them before any API call.
// Passwords are public by design (they're displayed on the login page).

export const DEMO_ACCOUNTS = [
  {
    id: "demo1",
    email: "abc@gmail.com",
    password: "ABC123456",
    name: "Abhijeet Sawant",
    role: "Full Stack Developer",
    atsScore: 86,
    mockCount: 5,
    pastInterviewScore: 74,
    skillBreakdown: {
      react: 90,
      javascript: 85,
      css: 80,
      testing: 78,
      communication: 82,
    },
    interviews: [
      {
        id: "int-1",
        company: "Amazon",
        type: "Technical round",
        date: "Mon Feb 7, 10:00 AM",
        score: 82,
      },
      {
        id: "int-2",
        company: "Google",
        type: "Behavioral",
        date: "Tue Feb 8, 5:00 PM",
        score: 79,
      },
    ],
    jobMatches: [
      { title: "Frontend Engineer", location: "Bengaluru", match: 94 },
      { title: "Backend Developer", location: "Pune", match: 88 },
    ],
  },
  {
    id: "demo2",
    email: "abhi@gmail.com",
    password: "ABHI123456",
    name: "Abhijeet S.",
    role: "Full Stack Developer",
    atsScore: 88,
    mockCount: 8,
    pastInterviewScore: 81,
    skillBreakdown: {
      react: 92,
      javascript: 88,
      css: 85,
      testing: 82,
      communication: 85,
    },
    interviews: [
      {
        "id": "int-1",
        company: "Microsoft",
        type: "Technical round",
        date: "Wed Feb 9, 11:00 AM",
        score: 85,
      },
      {
        id: "int-2",
        company: "Apple",
        type: "System Design",
        date: "Thu Feb 10, 4:00 PM",
        score: 81,
      },
    ],
    jobMatches: [
      { title: "Senior Frontend Engineer", location: "Bangalore", match: 96 },
      { title: "Full Stack Engineer", location: "Pune", match: 92 },
    ],
  },
];
