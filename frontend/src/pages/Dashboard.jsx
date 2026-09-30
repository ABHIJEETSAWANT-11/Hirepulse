import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Bot, CalendarDays, CheckCircle2, FileText, GraduationCap, MessagesSquare, BarChart3, Rocket, Target, Mic, Sparkles } from "lucide-react";

export default function Dashboard() {
  const { user, isDemo } = useUser();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "Student";

  // Hydrated from the logged-in account's profileData — demo accounts carry   // the full mock profile; real accounts get whatever
  // MongoDB has (falls back to honest placeholders until data exists).
  const profile = user?.profile || user?.profileData || null;
  const resumeScore = profile?.resumeScore ?? profile?.atsScore ?? null;
  const mockCount = profile?.mockCount ?? null;
  const pastInterviewScore = profile?.pastInterviewScore ?? null;
  const jobMatches = Array.isArray(profile?.jobMatches) ? profile.jobMatches : [];
  const skillBreakdown = profile?.skillBreakdown || null;
  const upcoming = Array.isArray(profile?.interviews) ? profile.interviews : [];

  const pastMetrics = profile?.pastMetrics || {};
  const getDelta = (current, past, isPercent) => {
    if (current == null || past == null) return null;
    const diff = current - past;
    if (diff === 0) return null;
    const isPositive = diff > 0;
    return {
      isPositive,
      text: `${isPositive ? '▲' : '▼'} ${Math.abs(diff)}${isPercent ? '%' : ''}`
    };
  };

  const stats = [
    { 
      title: "Resume Score", 
      value: resumeScore != null ? `${resumeScore}%` : "—", 
      delta: getDelta(resumeScore, pastMetrics.resumeScore, true),
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      title: "Interviews Given", 
      value: mockCount != null ? String(mockCount) : "0", 
      delta: getDelta(mockCount, pastMetrics.mockCount, false),
      icon: <MessagesSquare className="h-5 w-5" /> 
    },
    { 
      title: "Past Interview Score", 
      value: pastInterviewScore != null ? `${pastInterviewScore}%` : "—", 
      delta: getDelta(pastInterviewScore, pastMetrics.pastInterviewScore, true),
      icon: <BarChart3 className="h-5 w-5" /> 
    },
    { 
      title: "Courses Completed", 
      value: "3", 
      delta: getDelta(3, pastMetrics.coursesCompleted, false),
      icon: <GraduationCap className="h-5 w-5" /> 
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 bg-secondary/60">

      {/* Header */}
      <div className="relative flex items-center gap-4">
        <div>
          <h1 className="text-display text-3xl font-extrabold text-ink">
            Welcome back, {firstName}!
          </h1>
          <p className="text-black/50 text-sm mt-0.5">
            {isDemo
              ? "You're exploring a demo account — all data below is sample data."
              : "Here's your performance overview today."}
          </p>
        </div>
        {isDemo && (
          <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full bg-primary-tint text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" /> Demo account
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((card, i) => (
          <div key={i}
            className="relative p-6 rounded-2xl text-center bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(58,90,30,0.12)] group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner">
                {card.icon}
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{card.title}</h3>
              <div className="flex items-end justify-center gap-2">
                <p className="text-4xl font-extrabold text-ink drop-shadow-sm">{card.value}</p>
                {card.delta && (
                  <span className={`text-xs font-bold mb-1.5 px-1.5 py-0.5 rounded-md ${card.delta.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {card.delta.text}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Interview */}
        <div
          onClick={() => navigate("/app/interview")}
          className="col-span-2 p-8 rounded-2xl bg-gradient-to-br from-ink to-[#1a2e22] text-white relative overflow-hidden group cursor-pointer shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_50px_rgba(58,90,30,0.4)] transition-all duration-300 hover:-translate-y-1 border border-[#2a4533]"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(58,90,30,0.5)]">
                <Bot className="h-7 w-7 text-[#8fd654]" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">AI Interview</h2>
              <span className="ml-auto flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-bold bg-white/10 text-white backdrop-blur-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#8fd654] animate-pulse shadow-[0_0_8px_#8fd654]" /> Live
              </span>
            </div>
            <p className="text-white/70 mb-8 text-lg max-w-md leading-relaxed">
              Voice-based AI interviewer with instant follow-ups — practice as many rounds as you need in a professional setting.
            </p>
            <button className="px-8 py-4 rounded-xl font-bold bg-white text-ink text-base transition-all duration-300 hover:bg-[#f0f9eb] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-3">
              <Rocket className="h-5 w-5 text-primary" /> Start Mock Interview
            </button>
          </div>
        </div>

        {/* Calendar / upcoming rounds */}
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(58,90,30,0.08)] transition-all duration-300">
          <h2 className="text-xl font-bold text-ink flex items-center gap-3 mb-5">
            <div className="p-2 bg-navy/10 rounded-lg text-navy"><CalendarDays className="h-5 w-5" /></div> Calendar
          </h2>
          <div className="space-y-3">
            {(upcoming.length > 0
              ? upcoming.map((it) => `${it.company} — ${it.type} · ${it.date}`)
              : ["Mock Interview — Today 3PM", "Resume Submit — Tomorrow", "DSA Practice — Ongoing"]
            ).map((item, i) => (
              <div key={i}
                className="flex items-center gap-3 text-sm text-gray-600 rounded-xl px-4 py-3 bg-white border border-gray-100 shadow-sm hover:border-navy/30 hover:shadow-md transition-all">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-navy shadow-[0_0_8px_rgba(15,46,34,0.5)]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Job matches (hydrated) / Course recommendations */}
        <div className="col-span-2 p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(58,90,30,0.08)] transition-all duration-300">
          {jobMatches.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-ink flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><Target className="h-6 w-6" /></div> Job Matches For You
              </h2>
              <ul className="space-y-4">
                {jobMatches.map((job, i) => (
                  <li key={i}
                    className="flex items-center justify-between rounded-xl px-5 py-4 bg-white border border-gray-100 shadow-sm hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(58,90,30,0.08)] transition-all group/item cursor-pointer">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(58,90,30,0.5)]" />
                      <span className="text-gray-700 font-semibold text-lg group-hover/item:text-primary transition-colors truncate">
                        {job.title} <span className="text-gray-400 font-normal ml-2 text-sm">· {job.location}</span>
                      </span>
                    </div>
                    <span className="ml-4 shrink-0 text-sm px-4 py-2 rounded-full font-extrabold bg-primary-tint text-primary border border-primary/20 shadow-sm">
                      {job.match}% match
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-ink flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><GraduationCap className="h-6 w-6" /></div> Course Recommendations
              </h2>
              <ul className="space-y-4">
                {["DSA Mastery", "System Design Basics", "Resume Writing Workshop", "Mock Interview Bootcamp"].map((course, i) => (
                  <li key={i}
                    className="flex items-center justify-between rounded-xl px-5 py-4 bg-white border border-gray-100 shadow-sm hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(58,90,30,0.08)] transition-all group/item cursor-pointer">
                    <div className="flex items-center gap-4">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(58,90,30,0.5)]" />
                      <span className="text-gray-700 font-semibold text-lg group-hover/item:text-primary transition-colors">{course}</span>
                    </div>
                    <button className="text-sm px-6 py-2 rounded-xl font-bold bg-primary text-white hover:bg-primary-bright hover:shadow-lg transition-all duration-300">
                      Enroll
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Right column: skill breakdown (demo) or Todo */}
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(58,90,30,0.08)] transition-all duration-300">
          {skillBreakdown ? (
            <>
              <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><BarChart3 className="h-5 w-5" /></div> Skill Breakdown
              </h2>
              <div className="space-y-5">
                {Object.entries(skillBreakdown).map(([skill, v]) => (
                  <div key={skill}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 capitalize">{skill}</span>
                      <span className="text-sm font-extrabold text-primary">{v}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden shadow-inner">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-[#8fd654] shadow-[0_0_10px_rgba(58,90,30,0.4)]" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><CheckCircle2 className="h-5 w-5" /></div> Todo
              </h2>
              <ul className="space-y-4">
                {[
                  { icon: FileText, text: "Update Resume" },
                  { icon: Target, text: "Practice 2 DSA problems" },
                  { icon: Mic, text: "Attempt Mock Interview" },
                ].map((item, i) => (
                  <li key={i}
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer bg-white border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <item.icon size={18} strokeWidth={2} />
                    </span>
                    <span className="text-gray-700 font-medium text-sm group-hover:text-ink">{item.text}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
