import React from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { FileText, TrendingUp, CheckCircle2, Zap } from "lucide-react";

const resumeData = {
  name: "Abhijeet Sawant",
  role: "Full Stack Developer",
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
    "Include a relevant certifications section",
    "Optimize keywords for the roles you want",
    "Strengthen your summary statement",
  ],
};

const ResumeAnalyzer = () => {
  return (
    <section className="bg-[#F7F8FA]">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-eyebrow text-black/40">Resume lab</p>
          <h2 className="text-display mt-4 text-[36px] font-bold leading-[0.95] text-ink md:text-[48px]">
            Know your score before recruiters do
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-black/60">
            Upload once and see exactly what the screeners see — a clear ATS
            score, where it came from, and what to fix first.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ATS score card */}
          <div className="card-real flex flex-col items-center p-7 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-ink text-white">
              <FileText size={16} strokeWidth={1.8} />
            </div>
            <h3 className="mt-4 text-[17px] font-bold text-ink">{resumeData.name}</h3>
            <p className="text-[12px] text-black/50">{resumeData.role}</p>

            {/* Circular ATS score */}
            <div className="relative mt-6 flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(15,15,15,0.06)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3A5A1E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${resumeData.atsScore}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-display text-[34px] font-bold text-ink">
                  {resumeData.atsScore}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                  ATS score
                </span>
              </div>
            </div>

            <span className="mt-4 rounded-full bg-[#3A5A1E]/15 px-3 py-1 text-[11px] font-bold text-[#3A5A1E]">
              Good score
            </span>
          </div>

          {/* Radar + skill bars */}
          <div className="card-real p-6 lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-black/5 text-ink">
                <TrendingUp size={14} strokeWidth={1.8} />
              </div>
              <h3 className="text-[15px] font-bold text-ink">Skill breakdown</h3>
              <span className="pill-meta ml-auto">Sample report</span>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={resumeData.insights}>
                  <PolarGrid stroke="rgba(15,15,15,0.08)" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="transparent" />
                  <Radar
                    name="Skill"
                    dataKey="score"
                    stroke="#3A5A1E"
                    strokeWidth={2}
                    fill="#6BAE3A"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-3">
              {resumeData.insights.map((s) => (
                <div key={s.skill} className="flex items-center gap-3">
                  <span className="w-28 flex-shrink-0 text-[11px] text-black/50">{s.skill}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-black/5">
                    <motion.div
                      className="h-full rounded-full bg-pine"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.score}%` }}
                      transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] font-bold text-ink">{s.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Improvements strip */}
        <div className="card-real mt-6 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#3A5A1E]/15 text-[#3A5A1E]">
              <Zap size={14} strokeWidth={1.8} />
            </div>
            <h3 className="text-[15px] font-bold text-ink">Suggested improvements</h3>
            <span className="pill-meta ml-auto">Priority order</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {resumeData.improvements.map((tip, i) => (
              <div
                key={tip}
                className="flex items-start gap-2.5 rounded-[10px] border border-black/5 bg-[#FFFEFB] p-3"
              >
                <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-[#3A5A1E]" />
                <p className="text-[12px] leading-relaxed text-black/60">{tip}</p>
                <span className="ml-auto text-[10px] font-bold text-black/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeAnalyzer;
