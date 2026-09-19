// ---------- Local (offline) resume analysis ----------
// Exact port of local_resume_analysis() from backend-Py/main.py.
// Produces a useful ATS-style report without any external AI service.
// Used when GOOGLE_API_KEY is not set or when all Gemini models fail.

const SKILL_LEXICON = [
  "python", "java", "javascript", "typescript", "react", "node", "node.js", "express",
  "mongodb", "mysql", "postgresql", "sql", "aws", "azure", "gcp", "docker", "kubernetes",
  "git", "github", "rest api", "graphql", "html", "css", "tailwind", "redux",
  "machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "pandas", "numpy",
  "data analysis", "power bi", "tableau", "excel", "agile", "scrum", "jira",
  "communication", "leadership", "teamwork", "problem-solving", "c++", "c#", ".net",
  "spring boot", "django", "flask", "fastapi", "android", "kotlin", "swift",
]

const ACTION_VERBS = [
  "built", "developed", "designed", "led", "managed", "implemented", "created",
  "improved", "optimized", "launched", "delivered", "architected", "automated", "reduced", "increased",
]

const SECTION_HINTS = {
  Education: ["education", "b.tech", "b.e", "bachelor", "master", "m.tech", "university", "college", "cgpa"],
  Experience: ["experience", "intern", "employment", "work history", "professional"],
  Projects: ["project", "portfolio"],
  Skills: ["skills", "technical skills", "technologies"],
  Certifications: ["certification", "certificate", "course"],
  "Contact info": ["email", "phone", "linkedin", "github", "@"],
}

const localResumeAnalysis = (resumeText, jobDescription = null) => {
  const textLower = resumeText.toLowerCase()
  const words = textLower.match(/[a-zA-Z]+/g) || []
  const wordCount = words.length

  // --- Skills detected ---
  const foundSkills = SKILL_LEXICON.filter((s) => textLower.includes(s))

  // --- Sections present ---
  const presentSections = Object.keys(SECTION_HINTS).filter((name) =>
    SECTION_HINTS[name].some((h) => textLower.includes(h))
  )
  const missingSections = Object.keys(SECTION_HINTS).filter((name) => !presentSections.includes(name))

  // --- Contact signals ---
  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.]+/.test(resumeText)
  const hasPhone = /(\+?\d[\d\s-]{8,}\d)/.test(resumeText)
  const hasLinks = /(linkedin|github|portfolio)/.test(textLower)

  // --- Action verbs / quantification ---
  const verbHits = ACTION_VERBS.reduce((n, v) => n + (textLower.includes(v) ? 1 : 0), 0)
  const hasMetrics = /\d+\s?(%|percent|x\b|k\b|lpa|lakhs|users|customers)/.test(textLower)

  // --- Job description match ---
  let jdSkills = []
  let jdMatchPct = null
  if (jobDescription && jobDescription.trim()) {
    const jdLower = jobDescription.toLowerCase()
    jdSkills = SKILL_LEXICON.filter((s) => jdLower.includes(s))
    if (jdSkills.length > 0) {
      const matched = jdSkills.filter((s) => textLower.includes(s))
      jdMatchPct = Math.round((100 * matched.length) / jdSkills.length)
    }
  }

  // --- ATS score ---
  let score = 40
  score += Math.min(20, foundSkills.length * 2) // skills richness (max 20)
  score += Math.min(15, 5 * presentSections.length) // section coverage (max 15)
  if (hasEmail) score += 8
  if (hasPhone) score += 5
  if (hasLinks) score += 4
  score += Math.min(10, verbHits * 2) // action verbs (max 10)
  if (hasMetrics) score += 5
  if (wordCount < 150) score -= 5 // too thin
  if (wordCount > 1200) score -= 5 // too long
  if (jdMatchPct !== null) {
    score = Math.round(0.6 * score + 0.4 * jdMatchPct)
  }
  score = Math.max(5, Math.min(97, score))

  let strength
  if (score >= 80) strength = "Strong — your resume is competitive for ATS screening"
  else if (score >= 60) strength = "Moderate — solid base with clear improvement areas"
  else strength = "Needs work — several fundamentals are missing"

  const lines = []
  lines.push("OVERALL PROFILE STRENGTH")
  lines.push(`${strength}. Estimated ATS Score: ${score}/100.`)
  lines.push("")
  lines.push("KEY SKILLS DETECTED")
  lines.push(
    foundSkills.length > 0
      ? foundSkills.slice(0, 14).map((s) => titleCase(s)).join(", ")
      : "No standard technical skills detected — spell them out explicitly (e.g. React, Python, SQL)."
  )
  lines.push("")
  lines.push("AREAS FOR IMPROVEMENT")
  if (!hasMetrics) {
    lines.push('• Add quantified achievements (e.g. "improved load time by 40%", "served 10k users").')
  }
  if (verbHits < 4) {
    lines.push("• Start bullet points with strong action verbs (Built, Led, Optimized, Delivered…).")
  }
  if (wordCount < 200) {
    lines.push("• Resume looks thin — expand project and experience bullets with outcomes.")
  }
  if (wordCount > 1200) {
    lines.push("• Resume is too long — trim to the 1–2 most relevant pages.")
  }
  for (const sec of missingSections) {
    lines.push(`• Add a clear '${sec}' section with a standard heading.`)
  }
  if (!hasLinks) {
    lines.push("• Add LinkedIn / GitHub / portfolio links so recruiters can verify your work.")
  }
  if (jdMatchPct !== null) {
    const missingJd = jdSkills.filter((s) => !textLower.includes(s)).map((s) => titleCase(s))
    lines.push(
      `• Job-description match: ${jdMatchPct}%. Missing keywords: ` +
        (missingJd.slice(0, 10).join(", ") || "none — great match!") +
        "."
    )
  }
  if (
    !(
      !hasMetrics ||
      verbHits < 4 ||
      wordCount < 200 ||
      missingSections.length > 0 ||
      !hasLinks ||
      jdMatchPct !== null
    )
  ) {
    lines.push("• Fine-tune bullet phrasing and keep tailoring keywords per application.")
  }
  lines.push("")
  lines.push("RECOMMENDED COURSES")
  if (textLower.includes("python") || textLower.includes("data")) {
    lines.push("• Data Analysis with Python (freeCodeCamp / Coursera)")
  }
  if (textLower.includes("react") || textLower.includes("javascript") || textLower.includes("frontend")) {
    lines.push("• Advanced React & Performance (Scrimba / Udemy)")
  }
  if (textLower.includes("aws") || textLower.includes("cloud") || textLower.includes("devops")) {
    lines.push("• AWS Solutions Architect – Associate")
  }
  if (textLower.includes("sql") || textLower.includes("mongodb") || textLower.includes("database")) {
    lines.push("• Databases & SQL for Developers (Mode / Coursera)")
  }
  lines.push("• System Design Fundamentals (educative / Grokking)")
  lines.push("• STAR-method Interview Answering (LinkedIn Learning)")
  lines.push("")
  lines.push("JOB RECOMMENDATIONS")
  const topSkills = foundSkills.slice(0, 4).map((s) => titleCase(s))
  const profile = topSkills.length > 0 ? topSkills.join(" ") : "your skills"
  const secondRole =
    textLower.includes("python") || textLower.includes("sql") ? "Data Analyst" : "Full-Stack Developer"
  lines.push(`• Roles aligned to ${profile}: Software Engineer, ${secondRole},`)
  lines.push("  and Backend Engineer at product companies and startups. Aim at mid-size product")
  lines.push("  companies first — their ATS filters are friendlier to newer profiles.")
  lines.push("")
  lines.push("(Offline analysis engine — set GOOGLE_API_KEY in backend-Node/.env for richer AI feedback.)")
  return lines.join("\n")
}

// Python's str.title() equivalent — capitalizes the first letter of each
// word and lowercases the rest ("react" → "React", "rest api" → "Rest Api").
// Note: JS's built-in String.replace-based "title case" implementations differ;
// this mirrors Python semantics so skill output strings match exactly.
const titleCase = (s) =>
  s.replace(/([A-Za-z0-9]+)/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())

export { localResumeAnalysis }
