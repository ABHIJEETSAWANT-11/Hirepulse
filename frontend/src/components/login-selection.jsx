import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Briefcase } from "lucide-react";

export function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <div className="text-center mb-4">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-base font-bold text-white">
            H
          </span>
          <span className="text-lg font-bold tracking-tight text-ink">Hire Pulse.</span>
        </div>
        <h1 className="text-4xl font-bold text-ink mb-2">Welcome to HirePulse</h1>
        <p className="text-gray-500">Select your login type to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Login Card */}
        <Card
          className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/50 border-2 bg-white shadow-sm"
          onClick={() => navigate('/login/student')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-primary-tint flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl text-ink">Student Login</CardTitle>
            <CardDescription className="text-gray-500">
              Access your dashboard, interviews, and career resources
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2 text-sm text-gray-500">
              <p>✓ AI Mock Interviews</p>
              <p>✓ Resume Analysis</p>
              <p>✓ Job Recommendations</p>
              <p>✓ Learning Resources</p>
            </div>
            <button className="mt-6 w-full bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-bright hover:text-ink transition-all duration-300">
              Continue as Student
            </button>
            <p className="mt-3 text-xs text-gray-400">
              New here?{" "}
              <a
                href="/register"
                className="text-primary hover:underline font-medium"
                onClick={(e) => { e.stopPropagation(); navigate('/register'); }}
              >
                Create a Student Account
              </a>
            </p>
          </CardContent>
        </Card>

        {/* HR Login Card */}
        <Card
          className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/50 border-2 bg-white shadow-sm"
          onClick={() => navigate('/login/hr')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-ink flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-ink">HR Login</CardTitle>
            <CardDescription className="text-gray-500">
              Manage candidates, interviews, and recruitment
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2 text-sm text-gray-500">
              <p>✓ Candidate Management</p>
              <p>✓ Interview Scheduling</p>
              <p>✓ Analytics & Reports</p>
              <p>✓ Job Postings</p>
            </div>
            <button className="mt-6 w-full bg-ink text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300">
              Continue as HR
            </button>
            <p className="mt-3 text-xs text-gray-400">
              New here?{" "}
              <a
                href="/register/hr"
                className="text-primary hover:underline font-medium"
                onClick={(e) => { e.stopPropagation(); navigate('/register/hr'); }}
              >
                Create an HR Account
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
