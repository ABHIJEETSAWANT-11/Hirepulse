import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { BadgeCheck, Building2, GraduationCap, Mail, Pencil, Save, X } from "lucide-react";

export default function Profile() {
    const { user, setUser } = useUser();

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [company, setCompany] = useState(user?.company || "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    if (!user) {
        return (
            <div className="min-h-screen bg-secondary/60 flex items-center justify-center p-6">
                <div className="text-center bg-white border border-gray-200/70 rounded-2xl p-10 shadow-sm">
                    <p className="text-ink font-semibold mb-1">Not logged in</p>
                    <p className="text-gray-500 text-sm">Log in to view and edit your profile.</p>
                </div>
            </div>
        );
    }

    const isHR = user.userType === "hr";

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true); setError(""); setSaved(false);
        try {
            // The backend API is register-only right now, so persist edits
            // client-side (localStorage via context) and reflect instantly.
            setUser({ ...user, name, email, company });
            setSaved(true);
            setEditing(false);
        } catch {
            setError("Could not save your changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-secondary/60 p-6 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header card */}
                <div className="bg-ink text-white rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-20 pointer-events-none"
                        style={{ background: "radial-gradient(circle, #77A719, transparent 70%)" }} />
                    <div className="relative z-10 flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-3xl font-bold flex-shrink-0">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 truncate">
                                {user.name}
                                <BadgeCheck className="h-6 w-6 text-primary-bright flex-shrink-0" />
                            </h1>
                            <p className="text-white/60 text-sm mt-1 flex items-center gap-2">
                                {isHR
                                    ? <><Building2 className="h-4 w-4" /> HR Professional{user.company ? ` · ${user.company}` : ""}</>
                                    : <><GraduationCap className="h-4 w-4" /> Student</>}
                            </p>
                            <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" /> {user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details card */}
                <div className="bg-white border border-gray-200/70 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-ink">Account Details</h2>
                        {!editing && (
                            <button
                                onClick={() => { setEditing(true); setSaved(false); setName(user.name || ""); setEmail(user.email || ""); setCompany(user.company || ""); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-tint text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all"
                            >
                                <Pencil className="h-3.5 w-3.5" /> Edit Profile
                            </button>
                        )}
                    </div>

                    {saved && (
                        <div className="mx-6 mt-4 px-4 py-2.5 rounded-xl bg-primary-tint text-primary text-sm font-medium">
                            ✅ Profile updated.
                        </div>
                    )}

                    {editing ? (
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            {error && (
                                <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-destructive text-sm">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-ink placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-ink placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            {isHR && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Company</label>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        placeholder="e.g. Infosys"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-ink placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            )}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-bright hover:text-ink transition-all disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setEditing(false); setError(""); }}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary border border-gray-100 text-gray-500 text-sm font-semibold hover:text-ink transition-all"
                                >
                                    <X className="h-4 w-4" /> Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-secondary border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                                <p className="text-ink font-medium">{user.name}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                                <p className="text-ink font-medium truncate">{user.email}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Account Type</p>
                                <p className="text-ink font-medium capitalize">{user.userType || "student"}</p>
                            </div>
                            {isHR && (
                                <div className="p-4 rounded-xl bg-secondary border border-gray-100">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Company</p>
                                    <p className="text-ink font-medium">{user.company || "—"}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
