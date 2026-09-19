import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Mic, MicOff, Video, VideoOff, Play, Square, Send, FileText, Bot } from "lucide-react";

const STATE_COLOR = { speaking: "#77A719", listening: "#0A0A0A", idle: "#77A719" };

const Interview = () => {
    const [isInterviewing, setIsInterviewing] = useState(false);
    const [webcamEnabled, setWebcamEnabled] = useState(true); // always attempt to show camera
    const [camPermission, setCamPermission] = useState("pending"); // pending | granted | denied
    const [transcript, setTranscript] = useState("");
    const [currentResponse, setCurrentResponse] = useState("");
    const [aiResponse, setAiResponse] = useState("AI interviewer is ready.");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [conversationHistory, setConversationHistory] = useState([]);
    const [report, setReport] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [interviewerState, setInterviewerState] = useState("idle");
    const [aiStatus, setAiStatus] = useState(null); // backend /interview/status

    const webcamRef = useRef(null);
    const recognitionRef = useRef(null);
    // Guards so rapid mic results / double clicks / Enter spam don't fire
    // multiple parallel /interview/chat calls (each one burns quota).
    const chatInFlightRef = useRef(false);
    const lastSubmitAtRef = useRef(0);
    const SUBMIT_DEBOUNCE_MS = 2000;

    // On unmount: stop all camera tracks so the browser clears its stream reference.
    useEffect(() => {
        return () => {
            if (webcamRef.current && webcamRef.current.stream) {
                webcamRef.current.stream.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    // Poll the backend's Gemini status so a missing/rejected API key is
    // visible immediately instead of surfacing as mystery quota errors.
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const r = await fetch(`${import.meta.env.VITE_API_URL_NODE}/interview/status`);
                if (!r.ok) return;
                const s = await r.json();
                if (!cancelled) setAiStatus(s);
            } catch { /* backend down — banner stays hidden */ }
        };
        load();
        const t = setInterval(load, 30000);
        return () => { cancelled = true; clearInterval(t); };
    }, []);

    const handleUserMedia = () => {
        setCamPermission("granted");
        setErrorMsg("");
    };

    const handleUserMediaError = (err) => {
        console.warn("Camera error:", err);
        setCamPermission("denied");
        setWebcamEnabled(false);
    };

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const lastResult = event.results[event.results.length - 1];
                if (lastResult.isFinal) {
                    const text = lastResult[0].transcript;
                    setCurrentResponse(text);
                    handleUserSubmit(text);
                }
            };
            recognitionRef.current.onerror = (event) => {
                if (event.error === 'not-allowed') { setErrorMsg("Mic access denied."); setIsListening(false); }
            };
            recognitionRef.current.onend = () => { setIsListening(false); };
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try { recognitionRef.current.start(); setIsListening(true); setInterviewerState("listening"); setErrorMsg(""); } catch (e) { console.error(e); }
        }
    };
    const stopListening = () => {
        if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); if (interviewerState === "listening") setInterviewerState("idle"); }
    };

    const startInterview = () => {
        setIsInterviewing(true); setReport(null); setConversationHistory([]);
        setTranscript(""); setErrorMsg("");
        const opening = "Hello! I'm your AI interviewer today. Tell me about yourself and your background.";
        setAiResponse(opening);
        speak(opening);
    };

    const stopInterview = async () => {
        setIsInterviewing(false); stopListening();
        if (conversationHistory.length === 0) { setErrorMsg("No conversation to analyze. Speak first!"); return; }
        setAiResponse("Generating your feedback report… please wait.");
        setErrorMsg("");
        try {
            const historyText = conversationHistory.map(idx => `${idx.role}: ${idx.content}`).join("\n");
            // backend-Py absorbed into backend-Node — single API base now
            const response = await fetch(`${import.meta.env.VITE_API_URL_NODE}/interview/report`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversation: historyText })
            });
            if (!response.ok) {
                let payload = null;
                try { payload = await response.json(); } catch { /* non-JSON error body */ }
                const err = new Error(payload?.error || `Server error ${response.status}`);
                err.status = response.status;
                err.payload = payload;
                throw err;
            }
            const data = await response.json();
            if (data.report) {
                setReport(data.report);
                setAiResponse("Report ready! Click to view your feedback.");
            } else if (data.error) {
                setErrorMsg(`Report Error: ${data.error}`);
            }
        } catch (e) {
            console.error(e);
            if (e.status === 503) {
                // AI busy / misconfigured: do NOT clear the session — the user
                // can end & retry once the quota window frees up.
                setAiResponse("Report couldn't be generated right now. Your conversation is saved.");
                setErrorMsg(`
${e.message} — press "End & Get Report" again in a minute to retry.`);
            } else {
                setErrorMsg("Could not connect to report server. Is the backend running?");
            }
        }
    };

    const toggleWebcam = () => setWebcamEnabled(!webcamEnabled);
    const toggleMic = () => { if (isListening) stopListening(); else startListening(); };

    const handleUserSubmit = async (text) => {
        if (!text.trim()) return;
        if (chatInFlightRef.current) return; // previous turn still processing
        if (Date.now() - lastSubmitAtRef.current < SUBMIT_DEBOUNCE_MS) return; // debounce rapid submits
        lastSubmitAtRef.current = Date.now();
        chatInFlightRef.current = true;
        setConversationHistory(prev => [...prev, { role: "User", content: text }]);
        setTranscript(prev => prev + "\nYou: " + text);
        setCurrentResponse(""); setLoading(true); setErrorMsg(""); stopListening();
        try {
            // backend-Py absorbed into backend-Node — single API base now
            const response = await fetch(`${import.meta.env.VITE_API_URL_NODE}/interview/chat`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            if (!response.ok) {
                let payload = null;
                try { payload = await response.json(); } catch { /* non-JSON error body */ }
                const err = new Error(payload?.error || `Server error ${response.status}`);
                err.status = response.status;
                err.payload = payload;
                throw err;
            }
            const data = await response.json();

            const aiText = data.response ||
                "Thank you for your answer. Could you elaborate a bit more on that?";

            setAiResponse(aiText);
            setTranscript(prev => prev + "\nAI: " + aiText);
            setConversationHistory(prev => [...prev, { role: "AI", content: aiText }]);
            if (data.fallback) {
                setErrorMsg(
                    data.dailyQuotaExceeded
                        ? "(AI quota used up for today — backup questions in use; resets at midnight Pacific)"
                        : "(AI quota busy — using backup question)"
                );
                setTimeout(() => setErrorMsg(""), 6000);
            } else {
                setErrorMsg("");
            }
            speak(aiText);
        } catch (error) {
            console.error("Interview chat error:", error);
            const recovery = "Could you please repeat or expand on your last answer?";
            setAiResponse(recovery);
            setTranscript(prev => prev + "\nAI: " + recovery);
            setConversationHistory(prev => [...prev, { role: "AI", content: recovery }]);
            speak(recovery);
            // 503 = backend says AI is misconfigured (missing/bad key) — surface why.
            setErrorMsg(
                error.status === 503 && error.payload?.error
                    ? `(${error.payload.error})`
                    : "(Network hiccup – continuing)"
            );
            setTimeout(() => setErrorMsg(""), 6000);
        } finally { chatInFlightRef.current = false; setLoading(false); }
    };

    const handleManualSubmit = (e) => { e.preventDefault(); handleUserSubmit(currentResponse); };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setInterviewerState("speaking");
            utterance.onend = () => setInterviewerState("idle");
            window.speechSynthesis.speak(utterance);
        }
    };

    const stateColor = STATE_COLOR[interviewerState] || STATE_COLOR.idle;
    const stateLabel = interviewerState === 'speaking' ? '🗣️ Speaking' : interviewerState === 'listening' ? '👂 Listening' : loading ? '🤔 Thinking' : '💼 Ready';

    return (
        <div className="min-h-screen p-6 flex flex-col gap-6 bg-secondary/60">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-ink">AI Mock Interview</h1>
                </div>
                <div className="flex gap-3">
                    {!isInterviewing ? (
                        <>
                            {conversationHistory.length > 0 && !report && (
                                <button onClick={stopInterview}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold bg-secondary text-ink border border-primary/30 transition-all duration-300 hover:scale-105">
                                    <FileText className="w-4 h-4" /> Retry Report
                                </button>
                            )}
                            <button onClick={startInterview}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold bg-primary text-white transition-all duration-300 hover:bg-primary-bright hover:text-ink hover:scale-105 shadow-md shadow-primary/25">
                                <Play className="w-4 h-4" /> Start Interview
                            </button>
                        </>
                    ) : (
                        <button onClick={stopInterview}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold bg-destructive text-white transition-all duration-300 hover:scale-105 shadow-md shadow-destructive/25">
                            <Square className="w-4 h-4" /> End & Get Report
                        </button>
                    )}
                </div>
            </div>

            {/* Report Modal */}
            {report && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
                    <div className="rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-white border border-gray-200 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-ink flex items-center gap-2">
                                <FileText className="text-primary" /> Interview Analysis
                            </h2>
                            <button onClick={() => setReport(null)}
                                className="px-3 py-1 rounded-full text-gray-500 hover:text-ink bg-secondary transition-colors">
                                Close
                            </button>
                        </div>
                        {typeof report === 'object' ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-tint border border-primary/20">
                                    <div className="text-4xl font-bold text-primary">
                                        {report.score}/10
                                    </div>
                                    <div className="text-gray-500 text-sm">Overall Performance Score</div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-ink mb-2">Feedback</h3>
                                    <p className="text-gray-600 leading-relaxed">{report.overall_feedback}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-teal-50 border border-teal-100">
                                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-teal-700">✅ Strengths</h3>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                                            {report.strengths?.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                    <div className="p-4 rounded-xl bg-primary-tint/60 border border-primary/20">
                                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">🚀 Improvements</h3>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                                            {report.improvements?.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap text-gray-600">{report}</div>
                        )}
                    </div>
                </div>
            )}

            {/* AI service status banner (missing/rejected key) */}
            {aiStatus && !aiStatus.aiAvailable && (
                <div className="rounded-xl px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                    <strong>AI service not configured:</strong>{" "}
                    {aiStatus.keyConfigured
                        ? "Gemini rejected the API key (check it is valid and Generative Language API is enabled for the project)."
                        : "GOOGLE_API_KEY is missing in backend-Node/.env — get a free key at aistudio.google.com/apikey, add it, and restart the backend."}
                    {aiStatus.lastModelUsed && (
                        <span className="block mt-1 text-xs text-red-500">Last model served: {aiStatus.lastModelUsed}</span>
                    )}
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
                {/* User Cam */}
                <div className="relative rounded-2xl overflow-hidden flex flex-col h-[400px] lg:h-auto bg-white border border-gray-200/70 shadow-sm">
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-sm font-semibold bg-ink/80 text-white backdrop-blur-sm">
                        You {isListening && <span className="ml-2 animate-pulse text-primary-bright">● REC</span>}
                    </div>
                    <div className="flex-grow flex items-center justify-center bg-slate-900 relative">
                        {webcamEnabled ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover"
                                videoConstraints={{ facingMode: "user" }}
                                onUserMedia={handleUserMedia}
                                onUserMediaError={handleUserMediaError}
                            />
                        ) : camPermission === "denied" ? (
                            <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 border border-white/20">
                                    <VideoOff className="w-8 h-8 text-primary-bright" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold mb-1">Camera Blocked</p>
                                    <p className="text-white/50 text-xs leading-relaxed max-w-[220px]">
                                        Click the 🔒 lock icon in your browser's address bar → Site settings → Camera → Allow
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setCamPermission("pending"); setWebcamEnabled(true); }}
                                    className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-white transition-all hover:scale-105">
                                    🔄 Retry Camera
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                                <VideoOff className="w-12 h-12" />
                                <p>Camera Off</p>
                            </div>
                        )}
                    </div>
                    {/* Controls */}
                    <div className="p-4 flex justify-center gap-4 bg-secondary border-t border-gray-100">
                        <button onClick={toggleWebcam}
                            className="p-3 rounded-full transition-all duration-200 hover:scale-110"
                            style={webcamEnabled
                                ? { background: "#77A719", color: "#fff" }
                                : { background: "rgba(0,0,0,0.06)", color: "#b91c1c", border: "1px solid rgba(185,28,28,0.25)" }}>
                            {webcamEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>
                        <button onClick={toggleMic}
                            className="p-3 rounded-full transition-all duration-200 hover:scale-110"
                            style={isListening
                                ? { background: "#0A0A0A", color: "#fff", animation: "pulse 1s infinite" }
                                : { background: "rgba(119,167,25,0.12)", border: "1px solid rgba(119,167,25,0.3)", color: "#77A719" }}>
                            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* AI Area */}
                <div className="flex flex-col gap-5">
                    {/* AI Avatar */}
                    <div className="flex-grow rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px] bg-white border shadow-sm transition-all duration-500"
                        style={{ borderColor: `${stateColor}55`, boxShadow: `0 0 40px ${stateColor}18` }}>
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-primary-tint text-primary border border-primary/20">
                            AI Interviewer
                        </div>
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                            style={{ background: `radial-gradient(circle, ${stateColor}14, transparent 70%)` }} />

                        {/* Avatar */}
                        <div className="relative mb-6">
                            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 bg-secondary transition-all duration-500"
                                style={{ borderColor: stateColor, boxShadow: `0 0 40px ${stateColor}55`, transform: interviewerState === 'speaking' ? 'scale(1.05)' : 'scale(1)' }}>
                                <img src="/ai_interviewer_avatar.png" alt="AI Interviewer"
                                    className={`w-full h-full object-cover ${interviewerState === 'speaking' ? 'animate-speaking' : interviewerState === 'listening' ? 'animate-listening' : 'animate-idle'}`} />
                                {interviewerState === 'speaking' && (
                                    <div className="absolute inset-0 rounded-full border-4 animate-ping opacity-40" style={{ borderColor: "#77A719" }} />
                                )}
                                {interviewerState === 'listening' && (
                                    <div className="absolute inset-0 rounded-full border-4 animate-pulse" style={{ borderColor: "#0A0A0A" }} />
                                )}
                            </div>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap text-white"
                                style={{ background: stateColor, boxShadow: `0 0 10px ${stateColor}66` }}>
                                {stateLabel}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-ink mb-2">
                            {isInterviewing ? (loading ? "Thinking..." : isListening ? "I'm listening..." : "Your turn to speak") : "Ready to start?"}
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">{aiResponse}</p>
                        {errorMsg && <p className="text-destructive text-sm mt-2 font-semibold">{errorMsg}</p>}
                    </div>

                    {/* Transcript */}
                    <div className="rounded-2xl p-4 flex flex-col min-h-[200px] bg-white border border-gray-200/70 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-teal-700">Conversation</h4>
                        <div className="flex-grow whitespace-pre-wrap text-gray-500 leading-relaxed font-mono text-xs mb-3 overflow-y-auto max-h-[150px]">
                            {transcript || "Start the interview to begin the conversation..."}
                        </div>
                        <form onSubmit={handleManualSubmit} className="flex gap-2 mt-auto">
                            <input type="text" value={currentResponse} onChange={(e) => setCurrentResponse(e.target.value)}
                                placeholder="Type answer or use Mic..."
                                className="flex-grow px-3 py-2 rounded-full text-ink text-sm bg-secondary border border-gray-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                disabled={loading || !isInterviewing} />
                            <button type="submit"
                                className="px-4 py-2 rounded-full font-bold bg-primary text-white transition-all duration-200 hover:bg-primary-bright hover:text-ink hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={loading || !isInterviewing}>
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Interview;
