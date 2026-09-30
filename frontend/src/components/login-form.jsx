import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { DEMO_ACCOUNTS } from "@/data/demoAccounts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Mail, KeyRound, Lightbulb, ArrowRight } from "lucide-react";

export function LoginForm({ userType = "student" }) {
  const navigate = useNavigate();
  const { login, setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || "Invalid email or password. Please try again.");
        return;
      }

      if (result.isDemoAccount) {
        navigate("/app");
        return;
      }

      // Real account — context already holds the session.
      navigate("/app");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  const quickFill = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight text-ink">
            Welcome back
          </CardTitle>
          <CardDescription>
            Sign in to your placement workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  className="h-11 rounded-lg"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-lg"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-primary text-white font-semibold transition-all duration-200 hover:bg-primary-bright hover:text-white hover:scale-[1.02] disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-primary font-medium underline underline-offset-4 hover:no-underline"
              >
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Demo accounts — pure frontend, no MongoDB required */}
      <div className="rounded-xl border border-primary/20 bg-[#f7f9fc] p-5">
          <div className="flex items-start gap-3 mb-4">
            <span className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
              <Target size={18} strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="font-semibold text-ink text-sm">Demo accounts</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Try HirePulse without signing up — instant access, no database needed
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => handleDemoLogin(account.email, account.password)}
                className="w-full text-left bg-white rounded-lg p-3 cursor-pointer transition-all duration-200 border border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-semibold text-ink text-[13px]">{account.name}</p>
                  <span className="text-[10px] uppercase tracking-wide font-semibold bg-primary/10 text-primary-dark px-2 py-0.5 rounded-full">
                    {account.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Mail size={12} strokeWidth={1.75} />
                    {account.email}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <KeyRound size={12} strokeWidth={1.75} />
                    {account.password}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-0.5 font-semibold text-primary">
                    Use <ArrowRight size={12} strokeWidth={2} />
                  </span>
                </div>
                <div
                  className="sr-only"
                  onClick={(e) => {
                    e.stopPropagation();
                    quickFill(account);
                  }}
                />
              </button>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground mt-4 pt-3.5 border-t border-black/5 flex items-start gap-1.5">
            <Lightbulb size={13} strokeWidth={1.75} className="shrink-0 mt-px text-primary" />
            Click any account to auto-fill credentials, then press Sign in
          </p>
        </div>
    </div>
  );
}
