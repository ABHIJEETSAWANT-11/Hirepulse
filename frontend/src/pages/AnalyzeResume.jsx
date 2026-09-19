import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const AnalyzeResume = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError("");
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("❌ Please upload a resume first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("job_description", jobDescription);

        setLoading(true);
        setAnalysis("");
        setError("");

        try {
            // backend-Py absorbed into backend-Node — single API base now
            const response = await axios.post(`${import.meta.env.VITE_API_URL_NODE}/analyze-resume/`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.error) {
                setError(`❌ ${response.data.error}`);
            } else {
                setAnalysis(response.data.analysis);
            }
        } catch (error) {
            console.error("Error analyzing resume:", error);
            const errorMsg = error.response?.data?.error || error.response?.data?.detail || "Failed to analyze the resume. Please try again.";
            setError(`❌ ${errorMsg}`);
        }

        setLoading(false);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
        });

        const marginLeft = 40;
        const marginTop = 40;
        const maxWidth = 500;
        const lines = doc.splitTextToSize(analysis, maxWidth);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(lines, marginLeft, marginTop);
        doc.save("Resume_Analysis_Report.pdf");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF5E9] via-[#FFF8E7] to-[#FAF5E9] text-gray-900 p-6 font-sans">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#77A719] to-[#95CC29] bg-clip-text text-transparent">📄 Resume Analyzer</h2>

                <label className="w-full flex items-center gap-2 p-4 bg-white border-2 border-[#77A719]/30 rounded-2xl mb-6 cursor-pointer hover:border-[#77A719]/50 hover:shadow-lg transition-all duration-300">
                    <span role="img" aria-label="file">📎</span>
                    <span className="text-gray-700 font-medium">{file ? file.name : "Upload Resume (PDF)"}</span>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>

                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste Job Description (Optional)"
                    className="w-full h-32 p-4 bg-white border-2 border-[#77A719]/30 rounded-2xl mb-6 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#77A719] focus:ring-2 focus:ring-[#77A719]/20 transition-all"
                ></textarea>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`bg-gradient-to-r from-[#77A719] to-[#95CC29] text-white px-6 py-3 rounded-xl font-semibold mb-6 transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl hover:scale-105"
                        }`}
                >
                    {loading ? "Analyzing..." : "Analyze Resume"}
                </button>

                {error && <p className="text-red-400 mt-2">{error}</p>}

                {analysis && (
                    <div className="mt-8 border-2 border-[#77A719]/30 p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl">
                        <h3 className="text-2xl font-bold mb-4 text-[#77A719]">📝 Analysis Report:</h3>
                        <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">{analysis}</pre>

                        <button
                            onClick={handleDownloadPDF}
                            className="mt-6 bg-gradient-to-r from-[#FFCC00] to-[#FFD633] hover:shadow-lg hover:scale-105 px-6 py-3 rounded-xl text-gray-900 font-bold transition-all duration-300"
                        >
                            ⬇️ Download PDF Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyzeResume;
