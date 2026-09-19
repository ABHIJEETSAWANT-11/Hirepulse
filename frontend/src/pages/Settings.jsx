import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Check, Palette, Database, KeyRound, MonitorCog, Moon, Sun } from "lucide-react";

const APPEARANCE = [
    { id: "light", label: "Light (HireFlow)", icon: Sun, available: true },
    { id: "dark", label: "Dark charcoal", icon: Moon, available: false },
];

function Row({ icon, title, description, children }) {
    return (
        <div className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center flex-shrink-0">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-ink font-semibold text-sm">{title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{description}</p>
                </div>
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    );
}

function Toggle({ enabled, onChange }) {
    return (
        <button
            onClick={onChange}
            aria-pressed={enabled}
            className={`w-11 h-6 rounded-full relative transition-colors ${enabled ? "bg-primary" : "bg-gray-300"}`}
        >
            <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${enabled ? "left-[22px]" : "left-0.5"}`}
            />
        </button>
    );
}

export default function Settings() {
    const { user } = useUser();

    const [prefs, setPrefs] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("hirepulse:settings") || "{}");
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem("hirepulse:settings", JSON.stringify(prefs));
    }, [prefs]);

    const set = (key) => (value) => setPrefs((p) => ({ ...p, [key]: value }));

    // backend-Py absorbed into backend-Node — one base URL now
    const envKeys = [
        { key: "VITE_API_URL_NODE", label: "API base URL", placeholder: "http://localhost:3000" },
    ];

    return (
        <div className="min-h-screen bg-secondary/60 p-6 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-ink">Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Preferences for your HirePulse account{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.</p>
                </div>

                {/* Appearance */}
                <section className="bg-white border border-gray-200/70 rounded-2xl shadow-sm divide-y divide-gray-100">
                    <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                        <Palette className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold text-ink">Appearance</h2>
                    </div>
                    {APPEARANCE.map((theme) => {
                        const selected = (prefs.theme || "light") === theme.id;
                        return (
                            <Row
                                key={theme.id}
                                icon={<theme.icon className="h-5 w-5" />}
                                title={theme.label}
                                description={theme.available ? "Current theme" : "Coming soon — the old charcoal theme"}
                            >
                                {theme.available ? (
                                    selected ? (
                                        <span className="flex items-center gap-1.5 text-primary text-sm font-semibold">
                                            <Check className="h-4 w-4" /> Active
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => set("theme")(theme.id)}
                                            className="px-4 py-2 rounded-full bg-secondary border border-gray-100 text-gray-500 text-sm font-semibold hover:text-ink transition-all"
                                        >
                                            Use
                                        </button>
                                    )
                                ) : (
                                    <span className="text-xs text-gray-300 font-medium">Soon</span>
                                )}
                            </Row>
                        );
                    })}
                </section>

                {/* Notifications */}
                <section className="bg-white border border-gray-200/70 rounded-2xl shadow-sm divide-y divide-gray-100">
                    <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                        <MonitorCog className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold text-ink">Notifications</h2>
                    </div>
                    <Row
                        icon={<Check className="h-5 w-5" />}
                        title="Interview reminders"
                        description="Get a nudge before scheduled mock interviews"
                    >
                        <Toggle
                            enabled={prefs.interviewReminders !== false}
                            onChange={() => set("interviewReminders")(prefs.interviewReminders === false)}
                        />
                    </Row>
                    <Row
                        icon={<Check className="h-5 w-5" />}
                        title="Job recommendation alerts"
                        description="Notify me when new matching jobs appear"
                    >
                        <Toggle
                            enabled={prefs.jobAlerts !== false}
                            onChange={() => set("jobAlerts")(prefs.jobAlerts === false)}
                        />
                    </Row>
                    <Row
                        icon={<Check className="h-5 w-5" />}
                        title="Weekly progress summary"
                        description="A digest of your preparation stats every week"
                    >
                        <Toggle
                            enabled={prefs.weeklySummary === true}
                            onChange={() => set("weeklySummary")(prefs.weeklySummary !== true)}
                        />
                    </Row>
                </section>

                {/* Connections / environment */}
                <section className="bg-white border border-gray-200/70 rounded-2xl shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                        <Database className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold text-ink">Connections</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-tint/60 border border-primary/20">
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            <div>
                                <p className="text-ink text-sm font-semibold">MongoDB Atlas — Connected</p>
                                <p className="text-gray-500 text-xs">Cluster ac-yprqwxh… · database: hirepulse</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                            <KeyRound className="h-5 w-5 text-amber-600 flex-shrink-0" />
                            <div>
                                <p className="text-ink text-sm font-semibold">Gemini API key — Not configured</p>
                                <p className="text-gray-500 text-xs">AI resume analysis is disabled until a GOOGLE_API_KEY is set in backend-Node/.env</p>
                            </div>
                        </div>
                        {envKeys.map((env) => (
                            <div key={env.key}>
                                <label className="block text-sm font-medium text-gray-600 mb-1">{env.label}</label>
                                <input
                                    type="text"
                                    defaultValue={import.meta.env[env.key] || ""}
                                    placeholder={env.placeholder}
                                    readOnly
                                    className="w-full bg-secondary border border-gray-100 rounded-xl px-4 py-2.5 text-gray-500 text-sm focus:outline-none"
                                />
                                <p className="text-[11px] text-gray-400 mt-1">Set in frontend/.env — restart the dev server after changing</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
