import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, FileText, Mic, BrainCog, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    speech: "Analyzing…",
    eye: "Analyzing…",
    posture: "Analyzing…",
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setFeedback({
        speech: "Clear, steady",
        eye: "Good",
        posture: "Straight",
      });
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-14 sm:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-16 items-center">
          {/* Left — editorial copy */}
          <div>
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 shadow-real-sm">
                <span className="dot-live" />
                <span className="text-[12px] font-semibold tracking-[0.02em] text-black/60">
                  Placement season is live
                </span>
              </span>
            </div>

            <h1 className="text-display text-[44px] sm:text-[56px] lg:text-[64px] font-bold text-ink text-balance">
              Turn four years of engineering into your first offer.
            </h1>

            <p className="mt-6 max-w-[460px] text-[17px] leading-relaxed text-black/60">
              Practice voice-based mock interviews, make your resume ATS-proof, and
              drill the DSA patterns recruiters actually ask — in one focused
              workspace.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                onClick={() => navigate("/register")}
                className="h-11 rounded-full bg-pine px-7 text-[14px] font-bold text-white shadow-cta-green transition-all hover:-translate-y-px hover:bg-[#2F4A18] hover:shadow-real-md"
              >
                Start free <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <button
                onClick={() => navigate("/login")}
                className="h-11 px-2 text-[13px] font-medium text-black/50 transition-colors hover:text-ink"
              >
                Already have an account? <span className="underline underline-offset-4">Log in</span>
              </button>
            </div>

            {/* Avatars + social proof */}
            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {["AS", "PR", "KV", "MJ"].map((n) => (
                  <div
                    key={n}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold text-ink ring-2 ring-[#FFFEFB] shadow-real-sm"
                  >
                    {n}
                  </div>
                ))}
              </div>
              <p className="text-[13px] font-semibold text-ink">
                2,400+ students placed
                <span className="ml-1.5 font-normal text-black/50">this season</span>
              </p>
            </div>
          </div>

          {/* Right — dashboard mock */}
          <div className="relative">
            <div className="rounded-[20px] border border-black/10 bg-white shadow-real-lg transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06),0_24px_64px_rgba(0,0,0,0.1)]">
              {/* Browser chrome */}
              <div className="flex h-10 items-center gap-1.5 rounded-t-[20px] border-b border-black/5 bg-[#FAFAF8] px-4">
                <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
                <span className="ml-3 text-[11px] text-black/40">HirePulse — Student workspace</span>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4">
                {/* Menu column */}
                <div className="col-span-1 space-y-1.5">
                  {[
                    { icon: FileText, label: "Resume", active: false },
                    { icon: Mic, label: "Interview", active: true },
                    { icon: Briefcase, label: "Jobs", active: false },
                    { icon: BrainCog, label: "DSA 75", active: false },
                  ].map(({ icon: Icon, label, active }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-medium ${
                        active
                          ? "bg-ink text-white"
                          : "text-black/50 hover:bg-black/[0.03]"
                      }`}
                    >
                      <Icon size={13} strokeWidth={1.8} />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Stats column */}
                <div className="col-span-2 space-y-3">
                  <div className="rounded-xl border border-black/5 bg-[#FFFEFB] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">
                      Resume ATS
                    </p>
                    <div className="mt-1 flex items-end gap-2">
                      <span className="text-display text-3xl font-bold text-ink">82%</span>
                      <span className="mb-1 rounded-full bg-[#3A5A1E]/15 px-2 py-0.5 text-[10px] font-bold text-[#3A5A1E]">
                        Good
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-black/5">
                      <div className="h-full w-[82%] rounded-full bg-pine" />
                    </div>
                    <p className="mt-2 text-[11px] text-black/40">
                      Add quantified achievements to lift your score.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-black/5 bg-[#FFFEFB] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">
                        Mocks
                      </p>
                      <span className="text-display text-2xl font-bold text-ink">5</span>
                      <p className="mt-0.5 text-[11px] text-black/40">2 this week</p>
                    </div>
                    <div className="rounded-xl border border-black/5 bg-[#FFFEFB] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">
                        Avg score
                      </p>
                      <span className="text-display text-2xl font-bold text-ink">74%</span>
                      <p className="mt-0.5 text-[11px] text-black/40">+6% vs last week</p>
                    </div>
                    <div className="col-span-2 rounded-xl bg-navy p-3 text-white shadow-[0_4px_16px_rgba(15,46,34,0.2)]">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                        Up next
                      </p>
                      <p className="mt-1 text-[13px] font-semibold leading-snug">
                        System design weak spot — tomorrow 10am
                      </p>
                      <p className="mt-1 text-[11px] text-white/60">
                        Voice round with live feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating annotation */}
            <div className="absolute -bottom-4 left-6 flex items-center gap-2 rounded-full bg-ink px-4 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.15),0_8px_32px_rgba(0,0,0,0.1)]">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-moss">
                <Check size={9} strokeWidth={3} className="text-white" />
              </span>
              <span className="text-[11px] font-semibold text-white">
                Mock scored 84 — up 9 from last week
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
