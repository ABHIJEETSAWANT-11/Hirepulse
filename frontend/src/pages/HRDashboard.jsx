import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import {
    Users, Calendar, TrendingUp, Briefcase, UserCheck,
    X, MapPin, DollarSign, Clock, ChevronDown, BarChart2, PieChart,
    CheckCircle, Activity, Target
} from "lucide-react";

/* ─────────────────────────────────────────────
   MOCK DATA
   ───────────────────────────────────────────── */
const CANDIDATES = [
    { id: 1, name: "Abhijeet Sawant", position: "Software Engineer", score: "85%", status: "Pending" },
    { id: 2, name: "Neel Malpure", position: "Product Manager", score: "92%", status: "Interview Scheduled" },
    { id: 3, name: "Rohan Verma", position: "Data Analyst", score: "78%", status: "Under Review" },
    { id: 4, name: "Sarah Williams", position: "UX Designer", score: "88%", status: "Shortlisted" },
    { id: 5, name: "Alice Brown", position: "Frontend Developer", score: "80%", status: "Pending" },
    { id: 6, name: "Bob Wilson", position: "Backend Engineer", score: "74%", status: "Under Review" },
];

const TIME_SLOTS = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM",
];

const analyticsData = {
    funnel: [
        { stage: "Applications Received", count: 248 },
        { stage: "Screened", count: 142 },
        { stage: "Interviews Scheduled", count: 56 },
        { stage: "Offers Extended", count: 18 },
        { stage: "Hired", count: 12 },
    ],
    departments: [
        { name: "Engineering", hired: 5, open: 3 },
        { name: "Product", hired: 2, open: 2 },
        { name: "Design", hired: 2, open: 1 },
        { name: "Data", hired: 2, open: 2 },
        { name: "DevOps", hired: 1, open: 1 },
    ],
    monthly: [
        { month: "Sep", hires: 4 }, { month: "Oct", hires: 7 },
        { month: "Nov", hires: 5 }, { month: "Dec", hires: 3 },
        { month: "Jan", hires: 9 }, { month: "Feb", hires: 12 },
    ],
    metrics: [
        { label: "Avg. Days to Hire", value: "18 days", icon: <Clock className="w-5 h-5" />, color: "text-blue-600" },
        { label: "Offer Acceptance Rate", value: "91%", icon: <CheckCircle className="w-5 h-5" />, color: "text-primary" },
        { label: "Interview Pass Rate", value: "72%", icon: <Target className="w-5 h-5" />, color: "text-teal-700" },
        { label: "Active Job Postings", value: "8", icon: <Briefcase className="w-5 h-5" />, color: "text-primary" },
    ],
};

/* ─────────────────────────────────────────────
   MODAL WRAPPER
   ───────────────────────────────────────────── */
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-100 bg-white/95 backdrop-blur-sm rounded-t-2xl">
                    <h2 className="text-xl font-bold text-ink">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-secondary text-gray-400 hover:text-ink transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   INPUT COMPONENTS
   ───────────────────────────────────────────── */
function InputField({ label, icon, type = "text", value, onChange, placeholder, required }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
                {label} {required && <span className="text-destructive">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-ink placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${icon ? "pl-10" : ""}`}
                />
            </div>
        </div>
    );
}

function SelectField({ label, value, onChange, options, icon, required }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
                {label} {required && <span className="text-destructive">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
                )}
                <select
                    value={value}
                    onChange={onChange}
                    className={`w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${icon ? "pl-10" : ""}`}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   POST JOB MODAL
   ───────────────────────────────────────────── */
function PostJobModal({ onClose }) {
    const [form, setForm] = useState({
        title: "", department: "", location: "", locationType: "hybrid",
        ctcMin: "", ctcMax: "", experience: "", jobType: "full-time",
        openings: "1", skills: "", description: "", deadline: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <Modal title="✅ Job Posted Successfully" onClose={onClose}>
                <div className="text-center py-10 space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary-tint flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-ink">{form.title}</h3>
                    <p className="text-gray-500">{form.department} · {form.location}</p>
                    <p className="text-primary font-semibold">
                        ₹{form.ctcMin}L – ₹{form.ctcMax}L · {form.openings} Opening(s)
                    </p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-6 py-2.5 bg-primary rounded-full text-white font-semibold hover:bg-primary-bright hover:text-ink transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal title="📢 Post a New Job" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <InputField label="Job Title" required icon={<Briefcase className="w-4 h-4" />}
                            value={form.title} onChange={set("title")} placeholder="e.g. Senior Software Engineer" />
                    </div>
                    <InputField label="Department" required value={form.department} onChange={set("department")} placeholder="e.g. Engineering" />
                    <InputField label="Location" required icon={<MapPin className="w-4 h-4" />}
                        value={form.location} onChange={set("location")} placeholder="e.g. Bangalore, India" />
                    <SelectField label="Work Type" required value={form.locationType} onChange={set("locationType")} options={[
                        { value: "onsite", label: "On-site" },
                        { value: "remote", label: "Remote" },
                        { value: "hybrid", label: "Hybrid" },
                    ]} />
                    <SelectField label="Job Type" required value={form.jobType} onChange={set("jobType")} options={[
                        { value: "full-time", label: "Full-time" },
                        { value: "part-time", label: "Part-time" },
                        { value: "contract", label: "Contract" },
                        { value: "internship", label: "Internship" },
                    ]} />
                </div>

                {/* CTC */}
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Min CTC (LPA)" required type="number" icon={<DollarSign className="w-4 h-4" />}
                        value={form.ctcMin} onChange={set("ctcMin")} placeholder="e.g. 8" />
                    <InputField label="Max CTC (LPA)" required type="number" icon={<DollarSign className="w-4 h-4" />}
                        value={form.ctcMax} onChange={set("ctcMax")} placeholder="e.g. 15" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Experience Required" value={form.experience} onChange={set("experience")} placeholder="e.g. 2-4 years" />
                    <InputField label="No. of Openings" type="number" value={form.openings} onChange={set("openings")} placeholder="1" />
                </div>

                <InputField label="Required Skills" value={form.skills} onChange={set("skills")} placeholder="e.g. React, Node.js, SQL (comma separated)" />

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Job Description <span className="text-destructive">*</span></label>
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={set("description")}
                        placeholder="Describe the role, responsibilities, and requirements..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-ink placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                </div>

                <InputField label="Application Deadline" type="date" value={form.deadline} onChange={set("deadline")} />

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-full font-bold hover:bg-primary-bright hover:text-ink hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
                >
                    🚀 Post Job
                </button>
            </form>
        </Modal>
    );
}

/* ─────────────────────────────────────────────
   SCHEDULE INTERVIEW MODAL
   ───────────────────────────────────────────── */
function ScheduleInterviewModal({ onClose }) {
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");
    const [interviewType, setInterviewType] = useState("video");
    const [interviewer, setInterviewer] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const toggleCandidate = (id) => {
        setSelectedCandidates((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCandidates.length === 0 || !date || !slot) return;
        setSubmitted(true);
    };

    if (submitted) {
        const names = CANDIDATES.filter((c) => selectedCandidates.includes(c.id)).map((c) => c.name);
        return (
            <Modal title="✅ Interview Scheduled" onClose={onClose}>
                <div className="text-center py-10 space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary-tint flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-ink">Interview Confirmed!</h3>
                    <div className="bg-secondary rounded-xl p-4 text-left space-y-2 border border-gray-100">
                        <p className="text-gray-600"><span className="text-gray-400">Candidates:</span> {names.join(", ")}</p>
                        <p className="text-gray-600"><span className="text-gray-400">Date:</span> {date}</p>
                        <p className="text-gray-600"><span className="text-gray-400">Time:</span> {slot}</p>
                        <p className="text-gray-600"><span className="text-gray-400">Mode:</span> {interviewType.charAt(0).toUpperCase() + interviewType.slice(1)}</p>
                        {interviewer && <p className="text-gray-600"><span className="text-gray-400">Interviewer:</span> {interviewer}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-primary rounded-full text-white font-semibold hover:bg-primary-bright hover:text-ink transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal title="📅 Schedule Interview" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Candidate Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Select Candidates <span className="text-destructive">*</span>
                        <span className="text-gray-400 text-xs ml-2">({selectedCandidates.length} selected)</span>
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {CANDIDATES.map((c) => {
                            const selected = selectedCandidates.includes(c.id);
                            return (
                                <div
                                    key={c.id}
                                    onClick={() => toggleCandidate(c.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selected
                                        ? "border-primary bg-primary-tint/50"
                                        : "border-gray-100 bg-secondary hover:border-primary/40"
                                        }`}
                                >
                                    <div>
                                        <p className="text-ink font-medium text-sm">{c.name}</p>
                                        <p className="text-gray-500 text-xs">{c.position}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary text-xs font-semibold">{c.score}</span>
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selected ? "border-primary bg-primary" : "border-gray-300"
                                            }`}>
                                            {selected && <CheckCircle className="w-3 h-3 text-white fill-white" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Date & Slot */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Interview Date <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Time Slot <span className="text-destructive">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto">
                            {TIME_SLOTS.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setSlot(t)}
                                    className={`text-xs py-2 px-2 rounded-lg border transition-all ${slot === t
                                        ? "border-primary bg-primary-tint text-primary font-semibold"
                                        : "border-gray-100 bg-secondary text-gray-500 hover:border-primary/40 hover:text-ink"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Interview Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Interview Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                        {["video", "phone", "in-person"].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setInterviewType(type)}
                                className={`py-2 px-3 rounded-xl border text-sm capitalize transition-all ${interviewType === type
                                    ? "border-primary bg-primary-tint text-primary font-semibold"
                                    : "border-gray-100 bg-secondary text-gray-500 hover:border-primary/40"
                                    }`}
                            >
                                {type === "video" ? "🎥" : type === "phone" ? "📞" : "🏢"} {type}
                            </button>
                        ))}
                    </div>
                </div>

                <InputField
                    label="Interviewer Name"
                    icon={<UserCheck className="w-4 h-4" />}
                    value={interviewer}
                    onChange={(e) => setInterviewer(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Notes / Instructions</label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any instructions or notes for the candidate..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-ink placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={selectedCandidates.length === 0 || !date || !slot}
                    className="w-full bg-primary text-white py-3 rounded-full font-bold hover:bg-primary-bright hover:text-ink hover:shadow-lg hover:scale-[1.01] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                >
                    📅 Confirm Interview
                </button>
            </form>
        </Modal>
    );
}

/* ─────────────────────────────────────────────
   VIEW ANALYTICS MODAL
   ───────────────────────────────────────────── */
function ViewAnalyticsModal({ onClose }) {
    const maxHires = Math.max(...analyticsData.monthly.map((m) => m.hires));

    return (
        <Modal title="📊 Hiring Analytics" onClose={onClose}>
            <div className="space-y-6">
                {/* Key Metrics */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {analyticsData.metrics.map((m, i) => (
                            <div key={i} className="bg-secondary border border-gray-100 rounded-xl p-4 flex items-center gap-3">
                                <div className={m.color}>{m.icon}</div>
                                <div>
                                    <p className="text-ink font-bold text-lg">{m.value}</p>
                                    <p className="text-gray-500 text-xs">{m.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hiring Funnel */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Recruitment Funnel
                    </h3>
                    <div className="space-y-2">
                        {analyticsData.funnel.map((stage, i) => {
                            const pct = Math.round((stage.count / analyticsData.funnel[0].count) * 100);
                            return (
                                <div key={i}>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>{stage.stage}</span>
                                        <span className="font-semibold text-ink">{stage.count} <span className="text-gray-400">({pct}%)</span></span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-3 border border-gray-100">
                                        <div
                                            className="bg-primary h-3 rounded-full transition-all duration-700"
                                            style={{ width: `${pct}%`, opacity: 1 - i * 0.13 }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Monthly Hires Bar Chart */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" /> Monthly Hires (Last 6 Months)
                    </h3>
                    <div className="flex items-end gap-2 h-28">
                        {analyticsData.monthly.map((m, i) => {
                            const pct = Math.round((m.hires / maxHires) * 100);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-ink text-xs font-semibold">{m.hires}</span>
                                    <div
                                        className="w-full rounded-t-md bg-primary-bright transition-all duration-700"
                                        style={{ height: `${pct}%` }}
                                    />
                                    <span className="text-gray-400 text-xs">{m.month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Department Breakdown */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <PieChart className="w-4 h-4" /> Department Breakdown
                    </h3>
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-secondary border-b border-gray-100">
                                    <th className="text-left px-4 py-2 text-gray-500 font-medium">Department</th>
                                    <th className="text-center px-4 py-2 text-gray-500 font-medium">Hired</th>
                                    <th className="text-center px-4 py-2 text-gray-500 font-medium">Open Roles</th>
                                    <th className="text-center px-4 py-2 text-gray-500 font-medium">Fill Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analyticsData.departments.map((d, i) => {
                                    const fillRate = Math.round((d.hired / (d.hired + d.open)) * 100);
                                    return (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-secondary/60 transition-colors">
                                            <td className="px-4 py-3 text-ink font-medium">{d.name}</td>
                                            <td className="px-4 py-3 text-center text-primary font-semibold">{d.hired}</td>
                                            <td className="px-4 py-3 text-center text-amber-600">{d.open}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${fillRate >= 70 ? "bg-primary-tint text-primary" : "bg-amber-50 text-amber-700"}`}>
                                                    {fillRate}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

/* ─────────────────────────────────────────────
   MAIN DASHBOARD
   ───────────────────────────────────────────── */
export default function HRDashboard() {
    const [modal, setModal] = useState(null);
    const { user } = useUser();
    const hrName = user?.name || "HR";

    return (
        <div className="min-h-screen bg-secondary/60 p-6 md:p-8 space-y-6">
            {/* Modals */}
            {modal === "postJob" && <PostJobModal onClose={() => setModal(null)} />}
            {modal === "scheduleInterview" && <ScheduleInterviewModal onClose={() => setModal(null)} />}
            {modal === "analytics" && <ViewAnalyticsModal onClose={() => setModal(null)} />}

            {/* Header */}
            <h1 className="text-3xl font-bold text-ink">
                👔 HR Dashboard — <span className="text-primary">{hrName}</span>
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Candidates" value="142" icon={<Users className="w-6 h-6" />} />
                <StatCard title="Active Interviews" value="23" icon={<Calendar className="w-6 h-6" />} />
                <StatCard title="Job Postings" value="8" icon={<Briefcase className="w-6 h-6" />} />
                <StatCard title="Hired This Month" value="12" icon={<UserCheck className="w-6 h-6" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recent Candidates */}
                <div className="bg-white border border-gray-200/70 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 col-span-2">
                    <h2 className="text-2xl font-bold mb-3 text-ink flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" /> Recent Candidates
                    </h2>
                    <div className="space-y-3">
                        {CANDIDATES.map((candidate) => (
                            <div key={candidate.id} className="bg-secondary/70 p-4 rounded-xl border border-gray-100 hover:border-primary/40 transition-all">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-ink font-semibold">{candidate.name}</h3>
                                        <p className="text-gray-500 text-sm">{candidate.position}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-primary font-bold">{candidate.score}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${candidate.status === "Shortlisted" ? "bg-primary-tint text-primary" :
                                            candidate.status === "Interview Scheduled" ? "bg-teal-50 text-teal-700" :
                                                "bg-gray-100 text-gray-500"
                                            }`}>{candidate.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200/70 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                    <h2 className="text-xl font-bold mb-4 text-ink">⚡ Quick Actions</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => setModal("postJob")}
                            className="w-full bg-primary text-white px-4 py-3 rounded-full font-semibold hover:bg-primary-bright hover:text-ink hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Briefcase className="w-4 h-4" /> Post New Job
                        </button>
                        <button
                            onClick={() => setModal("scheduleInterview")}
                            className="w-full bg-ink text-white px-4 py-3 rounded-full font-semibold hover:bg-gray-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" /> Schedule Interview
                        </button>
                        <button
                            onClick={() => setModal("analytics")}
                            className="w-full bg-primary-tint text-primary px-4 py-3 rounded-full font-semibold hover:bg-primary hover:text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <BarChart2 className="w-4 h-4" /> View Analytics
                        </button>
                    </div>

                    {/* Status Legend */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Status</p>
                        <div className="space-y-1.5">
                            {[
                                { label: "Shortlisted", color: "bg-primary" },
                                { label: "Interview Scheduled", color: "bg-teal-600" },
                                { label: "Under Review", color: "bg-amber-400" },
                                { label: "Pending", color: "bg-gray-300" },
                            ].map((s) => (
                                <div key={s.label} className="flex items-center gap-2 text-xs text-gray-500">
                                    <div className={`w-2 h-2 rounded-full ${s.color}`} />
                                    {s.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upcoming Interviews */}
                <div className="bg-white border border-gray-200/70 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-ink flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-primary" /> Upcoming Interviews
                    </h2>
                    <ul className="space-y-4">
                        {[
                            { candidate: "Alice Brown", position: "Frontend Developer", time: "Today, 2:00 PM", mode: "🎥 Video" },
                            { candidate: "Bob Wilson", position: "Backend Engineer", time: "Tomorrow, 10:00 AM", mode: "🏢 In-person" },
                            { candidate: "Carol Davis", position: "DevOps Engineer", time: "Feb 22, 3:00 PM", mode: "📞 Phone" },
                        ].map((interview, i) => (
                            <li key={i} className="flex items-center justify-between border-b border-gray-100 pb-3 hover:border-primary/40 transition-colors">
                                <div>
                                    <span className="text-ink font-medium block">{interview.candidate}</span>
                                    <span className="text-gray-500 text-sm">{interview.position}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-primary text-sm font-semibold block">{interview.time}</span>
                                    <span className="text-gray-400 text-xs">{interview.mode}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white border border-gray-200/70 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                    <h2 className="text-xl font-bold mb-4 text-ink flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-primary" /> Performance Metrics
                    </h2>
                    <div className="space-y-4">
                        <MetricBar label="Candidate Quality" percentage={85} />
                        <MetricBar label="Interview Success Rate" percentage={72} />
                        <MetricBar label="Time to Hire" percentage={68} />
                        <MetricBar label="Offer Acceptance Rate" percentage={91} />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   HELPER COMPONENTS
   ───────────────────────────────────────────── */
function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white border border-gray-200/70 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center group">
            <div className="flex justify-center mb-2 text-primary group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</h3>
            <p className="text-4xl font-bold text-ink group-hover:scale-110 transition-transform duration-300">
                {value}
            </p>
        </div>
    );
}

function MetricBar({ label, percentage }) {
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-gray-600 text-sm">{label}</span>
                <span className="text-gray-600 text-sm font-semibold">{percentage}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 border border-gray-100">
                <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
