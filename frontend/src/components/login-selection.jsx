import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Check } from "lucide-react";
import Logo from "@/components/Logo";

export function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <div className="text-center mb-4">
        <div className="mb-6 flex items-center justify-center">
          <Logo size={34} />
        </div>
        <h1 className="text-display text-4xl font-bold text-ink mb-2">Welcome to HirePulse</h1>
        <p className="text-[14px] text-black/50">Select your login type to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Student card */}
        <Card
          className="card-real card-real-hover cursor-pointer border-2 bg-white py-6 md:col-span-2 md:max-w-md md:mx-auto"
          onClick={() => navigate('/login/student')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#3A5A1E]/15 text-[#3A5A1E]">
              <GraduationCap size={26} strokeWidth={1.6} />
            </div>
            <CardTitle className="text-[22px] text-ink">Student</CardTitle>
            <CardDescription className="text-[13px] text-black/50">
              Practice, analyze, and track your prep
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mx-auto space-y-2 text-[13px] text-black/60 w-fit text-left">
              {["AI mock interviews", "Resume analysis", "Job recommendations", "DSA Top 75"].map((f) => (
                <p key={f} className="flex items-center gap-2">
                  <Check size={13} strokeWidth={2.5} className="text-[#3A5A1E]" />
                  {f}
                </p>
              ))}
            </div>
            <button className="mt-6 h-11 w-full rounded-full bg-pine px-6 text-[14px] font-bold text-white shadow-cta-green transition-all hover:-translate-y-px hover:bg-[#2F4A18]">
              Continue as Student
            </button>
            <p className="mt-3 text-xs text-black/40">
              New here?{" "}
              <a
                href="/register"
                className="font-semibold text-[#3A5A1E] hover:underline"
                onClick={(e) => { e.stopPropagation(); navigate('/register'); }}
              >
                Create a student account
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
