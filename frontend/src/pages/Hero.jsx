import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mic, Eye, User, Brain, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import TechMarquee from "../components/TechMarquee";

const Interviewee = "https://images.unsplash.com/photo-1607746882042-944635dfe10e";

const initialsOf = (name) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const CandidateCard = ({ name, role, footer, className }) => (
  <div
    className={`w-56 rounded-2xl bg-white p-4 shadow-[0_24px_60px_-24px_rgba(10,10,10,0.35)] ${className ?? ""}`}
  >
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-xs font-semibold text-ink">
        {initialsOf(name)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{name}</p>
        <p className="truncate text-xs text-gray-500">{role}</p>
      </div>
    </div>
    <p className="mt-3 text-xs text-gray-500">{footer}</p>
  </div>
);

const JobCard = ({ className }) => (
  <div
    className={`w-64 rounded-2xl p-5 text-white shadow-[0_24px_60px_-24px_rgba(14,79,69,0.6)] bg-teal-900 ${className ?? ""}`}
  >
    <p className="text-[11px] font-medium uppercase tracking-wider text-white/60">Microsoft</p>
    <p className="mt-1 text-base font-semibold">Senior Product Designer</p>
    <p className="mt-2 text-xs leading-relaxed text-white/70">
      Shape hiring workflows with explainable AI and human approvals.
    </p>
    <div className="mt-3 flex gap-2">
      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium">Full-Time</span>
      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium">Senior</span>
    </div>
    <div className="mt-4 border-t border-white/15 pt-3 text-sm font-semibold">
      $8,000/Month <span className="font-normal text-white/60">· San Francisco</span>
    </div>
  </div>
);

const ChatBubble = ({ name, role, teal, withArrow, className }) => (
  <div
    className={`flex items-center gap-2.5 rounded-full py-2.5 pl-2.5 pr-4 shadow-[0_16px_40px_-16px_rgba(10,10,10,0.4)] ${
      teal ? "bg-teal-900" : "bg-ink"
    } ${className ?? ""}`}
  >
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-[10px] font-semibold text-white">
      {initialsOf(name)}
    </span>
    <span className="whitespace-nowrap text-xs font-medium text-white">{name}</span>
    <span className="whitespace-nowrap text-[11px] text-white/60">· {role}</span>
    {withArrow && <ArrowRight className="h-4 w-4 shrink-0 text-white/80 rotate-90" />}
  </div>
);

const Hero = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    speech: "Analyzing...",
    eye: "Analyzing...",
    posture: "Analyzing...",
    confidence: "Analyzing..."
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedback({
        speech: "Clear and steady",
        eye: "Good eye contact",
        posture: "Straight posture",
        confidence: "Confident tone"
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Faint square-grid pattern (HireFlow signature) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,10,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 72%)",
        }}
      />
      {/* Soft green radial glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[480px] w-[840px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-tint opacity-70 blur-3xl"
      />

      {/* Floating decorative cards — desktop only */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <CandidateCard
          name="Maria Angelica M"
          role="Product Designer"
          footer="Interview ready"
          className="absolute left-[4%] top-14 -rotate-3"
        />
        <CandidateCard
          name="Marcus Alexandro"
          role="Data Analyst"
          footer="Resume scored 92"
          className="absolute right-[4%] top-24 rotate-2"
        />
        <JobCard className="absolute left-[4%] top-[46%] -rotate-2" />
        <ChatBubble
          name="Robert Williamson"
          role="Head of HRD"
          className="absolute right-[3%] top-[48%] rotate-2"
        />
        <ChatBubble
          name="Vinco Marconzo"
          role="HR"
          teal
          withArrow
          className="absolute right-[6%] top-[64%] -rotate-2"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-16 sm:pt-24 lg:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary-tint/60 text-primary text-sm font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI-Powered Interview Coach</span>
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl xl:text-[68px] xl:leading-[1.08] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Master Your Interview.{" "}
            <span className="text-gray-400">Land Your</span>
            <br />
            Dream Offer.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Practice with our advanced AI, get real-time feedback on your speech, body language,
            and confidence — humans stay in control of every career decision.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="h-12 rounded-full bg-primary-bright px-8 text-base font-semibold text-ink shadow-lg shadow-primary/20 transition-colors hover:bg-primary hover:text-white"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-2 bg-ink px-8 text-base font-semibold text-white hover:bg-gray-800 hover:text-white"
            >
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <Play className="ml-0.5 h-3 w-3 fill-white text-white" />
              </span>
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <TechMarquee />
          </div>
        </div>

        {/* Demo Interface — light glass card */}
        <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000 delay-500">
          <div className="relative group rounded-2xl overflow-hidden border border-gray-200/80 bg-white/70 shadow-[0_32px_80px_-32px_rgba(10,10,10,0.25)] backdrop-blur-xl">
            <div className="relative flex flex-col md:flex-row h-auto md:h-[480px]">
              {/* Main Video Area */}
              <div className="w-full md:w-3/4 relative bg-slate-900">
                <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                  <div className="bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" /> REC
                  </div>
                  <span className="text-white/80 text-sm font-medium backdrop-blur-sm px-2 py-0.5 rounded">Richard Gomez</span>
                </div>

                <div className="flex justify-center items-center h-full p-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full opacity-60 animate-pulse" />
                    <img
                      src={Interviewee}
                      alt="Interviewee"
                      className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-primary/60 shadow-2xl relative z-10"
                    />
                  </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                  <div className="p-2 rounded-full hover:bg-white/10 cursor-pointer transition text-white/70 hover:text-white"><Mic size={20} /></div>
                  <div className="p-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer text-white shadow-lg shadow-red-500/30"><Play size={20} className="fill-current ml-0.5" /></div>
                  <div className="p-2 rounded-full hover:bg-white/10 cursor-pointer transition text-white/70 hover:text-white"><Eye size={20} /></div>
                </div>
              </div>

              {/* Sidebar Analysis */}
              <div className="w-full md:w-1/4 bg-white/85 border-l border-gray-100 p-6 flex flex-col gap-5 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Live Analysis</h3>

                {[
                  { icon: Mic, label: "Speech", value: feedback.speech, color: "text-primary" },
                  { icon: Eye, label: "Eye Contact", value: feedback.eye, color: "text-blue-600" },
                  { icon: User, label: "Posture", value: feedback.posture, color: "text-teal-700" },
                  { icon: Brain, label: "Confidence", value: feedback.confidence, color: "text-orange-600" }
                ].map((item, index) => (
                  <div key={index} className="space-y-1.5 p-3 rounded-xl bg-secondary/70 border border-gray-100 transition hover:bg-primary-tint/50">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5"><item.icon size={13} /> {item.label}</span>
                    </div>
                    <div className={`text-sm font-semibold ${item.color} truncate`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
