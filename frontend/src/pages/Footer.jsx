import Logo from "@/components/Logo";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: ["Resume Lab", "Mock Interviews", "Job Matches", "DSA Top 75", "Scheduler"],
  },
  {
    title: "Resources",
    links: ["Prep Guide", "Interview Library", "Community", "Help Center"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-paper">
      <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-16 lg:pt-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Logo size={28} />
            <p className="mt-4 max-w-[300px] text-[13px] leading-relaxed text-black/60">
              One focused workspace for placement season — mock interviews,
              resume scoring, job matches, and DSA practice.
            </p>
            <div className="mt-6 flex space-x-2">
              {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-black/50 transition-all hover:-translate-y-px hover:border-black/20 hover:text-ink"
                  aria-label="Social link"
                >
                  <Icon size={14} strokeWidth={1.8} />
                </a>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className="dot-live" />
              <span className="text-[11px] font-semibold text-black/40">
                Built for the 2026 placement season
              </span>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-black/40">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] font-medium text-black/60 transition-colors hover:text-ink"
                    >
                      {link}
                    </a>
                  </li>
                 ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom band */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-black/5 pt-7 sm:flex-row sm:items-center">
          <p className="text-[12px] text-black/40">
            &copy; {new Date().getFullYear()} HirePulse. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {["Privacy", "Terms", "Status", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[12px] text-black/40 transition-colors hover:text-ink"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
