import React from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { FaFileAlt, FaChartLine, FaCheckCircle } from "react-icons/fa";

const resumeData = {
  name: "Abhijeet Sawant",
  role: "MERN Stack Developer",
  atsScore: 86,
  insights: [
    { skill: "React", score: 90 },
    { skill: "JavaScript", score: 85 },
    { skill: "CSS", score: 80 },
    { skill: "Testing", score: 75 },
    { skill: "Communication", score: 70 },
  ],
  improvements: [
    "Add quantified achievements to each role",
    "Include relevant certifications section",
    "Optimize keywords for ATS scanning",
    "Strengthen your summary statement",
  ],
};

const ResumeAnalyzer = () => {
  return (
    <section className="min-h-screen py-12 relative overflow-hidden bg-slate">

      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(119,167,25,0.12) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(14,79,69,0.08) 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ background: "rgba(119,167,25,0.12)", border: "1px solid rgba(119,167,25,0.3)", color: "#77A719" }}>
              <FaFileAlt /> AI-Powered Analysis
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-4">
              Resume{" "}
              <span style={{ background: "linear-gradient(90deg, #77A719, #0A0A0A)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Analyzer
              </span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Our AI scans your resume for ATS compatibility and gives you a detailed skill breakdown.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ATS Score Card */}
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
            <div className="rounded-2xl p-8 flex flex-col items-center text-center group transition-all duration-300 relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(119,167,25,0.25)", backdropFilter: "blur(12px)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at top, rgba(119,167,25,0.08), transparent 60%)" }} />
              <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(14,79,69,0.08), transparent 70%)" }} />

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-6"
                  style={{ background: "linear-gradient(135deg, rgba(119,167,25,0.2), rgba(14,79,69,0.1))", border: "1px solid rgba(119,167,25,0.35)", boxShadow: "0 0 30px rgba(119,167,25,0.25)" }}>
                  <FaFileAlt style={{ color: "#77A719" }} />
                </div>
                <h3 className="text-2xl font-bold text-ink mb-1">{resumeData.name}</h3>
                <p className="text-gray-500 mb-8">{resumeData.role}</p>

                {/* Circular ATS Score */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="rgba(10,10,10,0.06)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="url(#atsGrad)" strokeWidth="3"
                      strokeDasharray={`${resumeData.atsScore}, 100`}
                      style={{ filter: "drop-shadow(0 0 6px rgba(119,167,25,0.8))" }} />
                    <defs>
                      <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#77A719" />
                        <stop offset="100%" stopColor="#0A0A0A" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-ink">{resumeData.atsScore}</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400">ATS Score</span>
                  </div>
                </div>

                <div className="mt-4 px-4 py-1.5 rounded-full text-sm font-semibold"
                  style={{ background: "rgba(14,79,69,0.12)", color: "#0A0A0A", border: "1px solid rgba(14,79,69,0.3)" }}>
                  ✅ Good Score
                </div>
              </div>
            </div>

            {/* Improvements */}
            <div className="mt-4 rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(119,167,25,0.2)", backdropFilter: "blur(12px)" }}>
              <h4 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <span style={{ color: "#0A0A0A" }}>⚡</span> Suggested Improvements
              </h4>
              <ul className="space-y-2">
                {resumeData.improvements.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <FaCheckCircle className="flex-shrink-0 mt-0.5" style={{ color: "#77A719" }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Radar Chart */}
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>
            <div className="rounded-2xl p-6 h-full"
              style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(119,167,25,0.22)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-2 mb-6">
                <FaChartLine style={{ color: "#77A719" }} className="text-xl" />
                <h3 className="text-xl font-bold text-ink">Skill Breakdown</h3>
                <span className="ml-auto text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: "rgba(119,167,25,0.12)", color: "#77A719", border: "1px solid rgba(119,167,25,0.25)" }}>
                  AI Analysis
                </span>
              </div>

              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={resumeData.insights}>
                    <PolarGrid stroke="rgba(10,10,10,0.08)" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="transparent" />
                    <Radar name="Skill" dataKey="score" stroke="#77A719" strokeWidth={2.5} fill="#77A719" fillOpacity={0.18} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Skill bars */}
              <div className="mt-4 space-y-3">
                {resumeData.insights.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-28 flex-shrink-0">{s.skill}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(10,10,10,0.06)" }}>
                      <motion.div className="h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.score}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        viewport={{ once: true }}
                        style={{ background: "linear-gradient(90deg, #77A719, #0A0A0A)", boxShadow: "0 0 8px rgba(119,167,25,0.5)" }} />
                    </div>
                    <span className="text-xs font-bold w-8 text-right"
                      style={{ background: "linear-gradient(90deg,#a78bfa,#22d3ee)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {s.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResumeAnalyzer;
