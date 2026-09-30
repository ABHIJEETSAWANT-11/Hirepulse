import { useMemo, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { CircleCheck, FileDown, FileText, Sparkles, Target, TriangleAlert, UploadCloud } from "lucide-react";

/* ——— Rendering-only parser (fix #2) ———
   The API still returns a plain-text `analysis` string. We only reshape how it
   displays: extract the ATS score, skills, and improvement lines when the text
   matches the expected sections, and fall back to typeset prose otherwise.
   No changes to the request, response handling, or the PDF export source. */
const parseAnalysis = (raw) => {
  const text = (raw || "").trim();

  const scoreMatch = text.match(/(?:ATS[^0-9]{0,40})?(\d{1,3})\s*(?:%|\/\s*100)/i);
  const score = scoreMatch ? Math.min(100, parseInt(scoreMatch[1], 10)) : null;

  const sectionByHeading = (heading) => {
    // (?:...) around the heading is critical: without it the capture group
    // only existed in the LAST | alternative, so a match via an earlier
    // alternative (e.g. "Key Skills") left m[1] undefined and crashed.
    const re = new RegExp(`(?:${heading})[^:\\n]*:?\\s*\\n?([\\s\\S]*?)(?=\\n\\s*[A-Z][A-Za-z ]{3,30}:|$)`, "i");
    const m = text.match(re);
    if (!m || m[1] === undefined) return [];
    return m[1]
      .split(/\n+/)
      .map((line) => line.replace(/^\s*[-•*\d.)\]]+\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 10);
  };

  const skills = sectionByHeading("Key Skills|Skills Detected|Skills");
  const improvements = sectionByHeading("Areas for Improvement|Improvements|Suggestions");

  return { text, score, skills, improvements };
};

const ScoreRing = ({ score }) => (
  <div className="relative w-28 h-28 flex items-center justify-center">
    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(10,10,10,0.06)" strokeWidth="3" />
      <circle
        cx="18" cy="18" r="15.9155" fill="none"
        stroke={score >= 70 ? "#3A5A1E" : score >= 40 ? "#0F2E22" : "#DC2626"}
        strokeWidth="3" strokeLinecap="round"
        strokeDasharray={`${score}, 100`}
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-3xl font-bold text-ink">{score}</span>
      <span className="text-eyebrow text-gray-400">ATS score</span>
    </div>
  </div>
);

const AnalyzeResume = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError("");
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a resume first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    setLoading(true);
    setAnalysis("");
    setError("");

    try {
      // backend-Py absorbed into backend-Node — single API base now
      const response = await axios.post(`${import.meta.env.VITE_API_URL_NODE}/analyze-resume/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setAnalysis(response.data.analysis);
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      const errorMsg = error.response?.data?.error || error.response?.data?.detail || "Failed to analyze the resume. Please try again.";
      setError(errorMsg);
    }

    setLoading(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const marginLeft = 40;
    const marginTop = 40;
    const maxWidth = 500;
    const lines = doc.splitTextToSize(analysis, maxWidth);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(lines, marginLeft, marginTop);
    doc.save("Resume_Analysis_Report.pdf");
  };

  const report = useMemo(() => parseAnalysis(analysis), [analysis]);

  return (
    <div className="min-h-screen bg-secondary/60 text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-eyebrow text-primary mb-2">AI-powered analysis</p>
        <h2 className="text-display text-3xl md:text-4xl font-bold mb-8 text-ink">Resume Analyzer</h2>

        <label className="w-full flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl mb-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-300">
          <span className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5" />
          </span>
          <span className="text-gray-700 font-medium truncate">{file ? file.name : "Upload Resume (PDF)"}</span>
          <span className="ml-auto text-sm font-medium text-primary flex items-center gap-1.5 flex-shrink-0">
            <UploadCloud className="h-4 w-4" /> Browse
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* py-3.5 + leading-6 keep the first line clear of the padding box;
            resize-y with overflow-y-auto keeps the scrollbar out of the text */}
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste Job Description (Optional)"
          className="w-full h-32 px-4 py-3.5 bg-white border border-gray-200 rounded-2xl mb-4 text-gray-900 leading-6 placeholder-gray-400 resize-y overflow-y-auto focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        ></textarea>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-ink text-white px-6 py-3 rounded-full font-semibold mb-6 transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {analysis && (
          <div className="mt-8 rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden">
            {/* Report header + score */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border-b border-gray-100 bg-secondary/40">
              {report.score !== null ? (
                <ScoreRing score={report.score} />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-primary-tint flex items-center justify-center">
                  <Target className="h-10 w-10 text-primary" />
                </div>
              )}
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-xl font-bold text-ink">Analysis Report</h3>
                </div>
                <p className="text-sm text-gray-500">
                  {report.score !== null
                    ? "Estimated compatibility with the target role and job description."
                    : "AI feedback on your resume for the target role."}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Key skills as chips */}
              {report.skills.length > 0 && (
                <div>
                  <h4 className="text-eyebrow text-gray-400 mb-3">Key skills detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-navy/5 text-navy text-sm font-medium border border-navy/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements as icon bullets */}
              {report.improvements.length > 0 && (
                <div>
                  <h4 className="text-eyebrow text-gray-400 mb-3">Areas for improvement</h4>
                  <ul className="space-y-2.5">
                    {report.improvements.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                        <TriangleAlert className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full report as typeset prose — never a monospace dump */}
              <div>
                <h4 className="text-eyebrow text-gray-400 mb-3">Full report</h4>
                <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                  {report.text.split(/\n{2,}|\n(?=[A-Z][A-Za-z ]{3,30}:)/).map((para, i) => (
                    <p key={i}>{para.replace(/^\s*[-•*]\s*/gm, "• ").trim()}</p>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 bg-ink hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
              >
                <FileDown className="h-4 w-4" /> Download PDF Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeResume;
