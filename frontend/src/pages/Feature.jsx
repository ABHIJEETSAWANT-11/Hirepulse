import React from "react";
import { BrainCog, FileSearch, Target, CalendarCheck, Code2, ClipboardList } from "lucide-react";

const features = [
  {
    icon: BrainCog,
    title: "Voice mock interviews that feel real",
    description:
      "Speak your answers out loud and get instant, specific feedback on clarity, pace, and content — the way actual interview rounds run.",
    meta: "Live feedback",
    visual: "teal",
  },
  {
    icon: FileSearch,
    title: "A resume that survives the screener",
    description:
      "Upload your resume once and see exactly what recruiters' filters catch — missing keywords, weak verbs, sections that need work.",
    meta: "ATS score + fixes",
    visual: "light",
  },
  {
    icon: Target,
    title: "Jobs matched to where you actually are",
    description:
      "Curated openings filtered by role and location, with the skills each one asks for — no endless portal scrolling.",
    meta: "Role + location",
    visual: "dark",
  },
  {
    icon: Code2,
    title: "DSA practice with a plan, not a pile",
    description:
      "The 75 patterns that show up every season, organized by topic and difficulty so you always know what to do next.",
    meta: "Top 75",
    visual: "light",
  },
  {
    icon: CalendarCheck,
    title: "Every round on one calendar",
    description:
      "Technical, HR, follow-ups — track deadlines and prep blocks so nothing lands on you the night before.",
    meta: "Scheduler",
    visual: "light",
  },
  {
    icon: ClipboardList,
    title: "Progress you can point to",
    description:
      "Scores, streaks, and weak spots tracked across sessions — watch the numbers move as you practice.",
    meta: "Analytics",
    visual: "dark",
  },
];

const Visual = ({ kind }) => {
  if (kind === "teal") {
    return (
      <div className="rounded-2xl bg-navy p-5 text-white shadow-[0_4px_16px_rgba(15,46,34,0.2)]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
            Live session
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
            Q4 of 6
          </span>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-white/90">
          "Walk me through a time you disagreed with your team."
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8BC53F]" />
          <span className="text-[11px] text-white/50">Listening… speak your answer</span>
        </div>
      </div>
    );
  }
  if (kind === "dark") {
    return (
      <div className="rounded-2xl bg-ink p-5 text-white shadow-card-black">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
          New matches
        </p>
        <div className="mt-3 space-y-2.5">
          {[
            ["Frontend Engineer", "Bengaluru"],
            ["Backend Developer", "Pune"],
          ].map(([role, loc]) => (
            <div key={role} className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-white/90">{role}</span>
              <span className="text-[11px] text-white/50">{loc}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-px bg-white/10" />
        <p className="mt-3 text-[11px] text-white/50">12 fresh matches this week</p>
      </div>
    );
  }
  return (
    <div className="card-real p-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">
          ATS check
        </span>
        <span className="rounded-full bg-[#3A5A1E]/15 px-2 py-0.5 text-[10px] font-bold text-[#3A5A1E]">
          82%
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {[
          ["Skills", 88],
          ["Sections", 76],
          ["Keywords", 64],
        ].map(([label, v]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-16 text-[11px] text-black/50">{label}</span>
            <div className="h-1.5 flex-1 rounded-full bg-black/5">
              <div className="h-full rounded-full bg-pine" style={{ width: `${v}%` }} />
            </div>
            <span className="text-[11px] font-semibold text-ink">{v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeaturesGrid = () => {
  return (
    <section id="product" className="border-y border-black/5 bg-paper">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-eyebrow text-black/40">What's inside</p>
          <h2 className="text-display mt-4 text-[36px] font-bold leading-[0.95] text-ink md:text-[48px]">
            Everything placement season throws at you, in one place
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-black/60">
            Six focused tools that replace the tab-hopping — built for how
            campus placements actually work.
          </p>
        </div>

        <div className="mt-14 divide-y divide-black/5 border-y border-black/5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group grid grid-cols-1 gap-6 py-10 transition-colors hover:bg-black/[0.015] md:grid-cols-[64px_1.1fr_0.9fr] md:gap-6 md:py-12 lg:gap-8"
            >
              <div className="flex items-start gap-3 md:block">
                <span className="text-[14px] font-bold tracking-widest text-black/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="icon-feature md:mt-3">
                  <f.icon size={22} strokeWidth={1.6} />
                </div>
              </div>
              <div className="max-w-[480px]">
                <h3 className="text-[24px] font-bold leading-[0.95] tracking-[-0.02em] text-ink">
                  {f.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-black/60">
                  {f.description}
                </p>
                <span className="pill-meta mt-4">{f.meta}</span>
              </div>
              <div className="md:max-w-[360px]">
                <Visual kind={f.visual} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
