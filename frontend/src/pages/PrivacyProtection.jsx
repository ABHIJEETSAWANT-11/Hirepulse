import React from "react";
import { Shield, Lock, EyeOff, FileLock2 } from "lucide-react";

const points = [
  {
    icon: Lock,
    title: "Encrypted end to end",
    description: "Your recordings and reports travel encrypted and stay yours.",
  },
  {
    icon: EyeOff,
    title: "Camera stays local",
    description: "Practice rounds never store video — feedback is text and voice only.",
  },
  {
    icon: FileLock2,
    title: "Resumes are never shared",
    description: "Your resume is analyzed for you, then locked to your account.",
  },
  {
    icon: Shield,
    title: "Delete anytime",
    description: "One click wipes your history — no retention games.",
  },
];

const PrivacyProtection = () => {
  return (
    <section
      id="privacy"
      className="relative bg-[#0F0F0F] text-white"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at top, rgba(90,143,42,0.12) 0%, transparent 60%)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-eyebrow text-white/40">Privacy by design</p>
            <h2 className="text-display mt-4 text-[36px] font-bold leading-[0.95] md:text-[48px]">
              Your prep stays between us
            </h2>
            <p className="mt-5 max-w-[440px] text-[14px] leading-relaxed text-white/60">
              Interview practice only works when you can speak freely. We
              prioritize your anonymity and data protection — your sessions,
              recordings, and resume remain confidential and belong to you.
            </p>
            <div className="mt-8 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 w-fit">
              <Shield size={14} className="text-[#8BC53F]" />
              <span className="text-[12px] font-medium text-white/70">
                Nothing you say or upload is used to train anything.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {points.map((p) => (
              <div key={p.title} className="bg-[#0F0F0F] p-6 transition-colors hover:bg-[#151515]">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/10 text-white">
                  <p.icon size={15} strokeWidth={1.8} />
                </div>
                <h3 className="mt-4 text-[14px] font-bold text-white">{p.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/50">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyProtection;
