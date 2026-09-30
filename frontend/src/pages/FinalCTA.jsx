import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Zap } from "lucide-react";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-paper">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-24">
        <div
          className="rounded-[24px] bg-pine p-8 md:p-14"
          style={{ boxShadow: "0 8px 32px rgba(58,90,30,0.2)" }}
        >
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-display text-[40px] font-bold leading-[0.85] tracking-[-0.04em] text-white md:text-[56px]">
                Your first offer starts with one honest practice round.
              </h2>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={() => navigate("/register")}
                  className="h-12 rounded-full bg-white px-7 text-[14px] font-bold text-ink transition-all hover:-translate-y-px"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                >
                  Start free
                </button>
                <p className="text-[13px] font-medium text-white/70">
                  Free for students · No card required
                </p>
              </div>
            </div>

            <div className="space-y-3 text-[13px] leading-relaxed text-white/70">
              <p className="flex items-start gap-2.5">
                <Shield size={15} className="mt-0.5 flex-shrink-0 text-[#8BC53F]" />
                Voice rounds stay private — nothing is shared or sold.
              </p>
              <p className="flex items-start gap-2.5">
                <Zap size={15} className="mt-0.5 flex-shrink-0 text-[#8BC53F]" />
                Feedback in seconds, not days — practice as often as you want.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-[11px] font-medium text-white/50 sm:flex-row sm:items-center">
            <span>HirePulse — placement workspace</span>
            <span className="hidden md:block">Resume · Interviews · Jobs · DSA 75</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
