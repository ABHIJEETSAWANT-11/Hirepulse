import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Bot, CalendarDays, CheckCircle2, FileText, GraduationCap, MessagesSquare, BarChart3, Rocket } from "lucide-react";

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "Student";

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 bg-secondary/60">

      {/* Header */}
      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-primary-tint">
          👋
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-ink">
            Welcome back, {firstName}!
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's your performance overview today ✨</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Resume Score", value: "82%", icon: <FileText className="h-5 w-5" /> },
          { title: "Interviews Given", value: "5", icon: <MessagesSquare className="h-5 w-5" /> },
          { title: "Past Interview Score", value: "74%", icon: <BarChart3 className="h-5 w-5" /> },
          { title: "Courses Completed", value: "3", icon: <GraduationCap className="h-5 w-5" /> },
        ].map((card, i) => (
          <div key={i}
            className="p-6 rounded-2xl text-center bg-white border border-gray-200/70 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default">
            <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              {card.icon}
            </div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{card.title}</h3>
            <p className="text-4xl font-extrabold text-ink">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Interview */}
        <div
          onClick={() => navigate("/app/interview")}
          className="col-span-2 p-6 rounded-2xl bg-ink text-white relative overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300"
        >
          <div className="absolute top-0 right-0 w-40 h-40 opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #77A719, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">AI Interview</h2>
              <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold bg-primary-bright text-ink">
                ● Live
              </span>
            </div>
            <p className="text-white/60 mb-5">
              Your last score: <span className="font-bold text-xl text-primary-bright">74%</span>
            </p>
            <button className="px-6 py-3 rounded-full font-bold bg-primary-bright text-ink transition-all duration-300 hover:bg-primary hover:text-white hover:scale-105 flex items-center gap-2">
              <Rocket className="h-4 w-4" /> Start Mock Interview
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-primary" /> Calendar
          </h2>
          <div className="space-y-2">
            {["Mock Interview — Today 3PM", "Resume Submit — Tomorrow", "DSA Practice — Ongoing"].map((item, i) => (
              <div key={i}
                className="flex items-center gap-2 text-xs text-gray-500 rounded-xl px-3 py-2.5 bg-secondary border border-gray-100">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Recommendations */}
        <div className="col-span-2 p-6 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
          <h2 className="text-2xl font-bold text-ink flex items-center gap-2 mb-6">
            <GraduationCap className="h-6 w-6 text-primary" /> Course Recommendations
          </h2>
          <ul className="space-y-3">
            {["DSA Mastery", "System Design Basics", "Resume Writing Workshop", "Mock Interview Bootcamp"].map((course, i) => (
              <li key={i}
                className="flex items-center justify-between rounded-xl px-4 py-3 bg-secondary border border-gray-100 hover:border-primary/40 transition-colors group/item">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-gray-600 font-medium group-hover/item:text-ink transition-colors">{course}</span>
                </div>
                <button className="text-sm px-4 py-1.5 rounded-full font-semibold bg-primary-tint text-primary hover:bg-primary hover:text-white transition-all duration-200">
                  Enroll
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Todo List */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
          <h2 className="text-xl font-bold text-ink mb-5 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" /> Todo
          </h2>
          <ul className="space-y-3">
            {[
              { icon: "📄", text: "Update Resume" },
              { icon: "🎯", text: "Practice 2 DSA problems" },
              { icon: "🎙️", text: "Attempt Mock Interview" },
            ].map((item, i) => (
              <li key={i}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-secondary border border-gray-100 hover:border-primary/40 hover:bg-primary-tint/40 transition-all">
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-500 group-hover/todo:text-ink text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
