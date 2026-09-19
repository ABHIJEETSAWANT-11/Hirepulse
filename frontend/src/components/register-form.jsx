import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({ className, userType = "student", ...rest }) {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const isHR = userType === "hr";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { name, email, password, userType };
      if (isHR && company) payload.company = company;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_NODE}/api/users`,
        payload
      );

      const { _id, name: userName, email: userEmail, userType: type } = response.data;
      setUser({ _id, name: userName, email: userEmail, userType: type || userType });

      navigate(isHR ? "/hr" : "/app");
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg === "User already exists") {
        setError("An account with this email already exists. Please log in.");
      } else {
        setError("Sign up failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...rest}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isHR ? "Create HR Account" : "Create your free account"}
          </CardTitle>
          <CardDescription>
            {isHR
              ? "Sign up as an HR professional to manage candidates & interviews"
              : "Sign up as a student — no credit card required"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={isHR ? "e.g. Ananya Sharma" : "e.g. Abhijeet Sawant"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {isHR && (
                <div className="grid gap-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="e.g. Infosys, TCS, Startup Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isHR ? "hr@company.com" : "you@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className={`w-full rounded-full ${
                  isHR
                    ? "bg-ink text-white hover:bg-gray-800"
                    : "bg-primary text-white hover:bg-primary-bright hover:text-ink"
                }`}
                disabled={loading}
              >
                {loading
                  ? "Creating account…"
                  : isHR
                    ? "Create HR Account"
                    : "Sign Up — It's Free"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a
                href={isHR ? "/login/hr" : "/login/student"}
                className="text-primary font-medium underline underline-offset-4 hover:no-underline"
              >
                Log in
              </a>
              {!isHR && (
                <>
                  {" · "}
                  <a href="/register/hr" className="text-primary font-medium underline underline-offset-4 hover:no-underline">
                    Sign up as HR
                  </a>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}