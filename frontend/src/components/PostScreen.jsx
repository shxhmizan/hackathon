import { useState } from "react"
import { createJob } from "../services/api"

export default function PostScreen() {
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [generatedJob, setGeneratedJob] = useState(null)
    const [error, setError] = useState(null)

    async function handleSubmit() {
        if (prompt.length < 5) return
        setLoading(true)
        setGeneratedJob(null)
        setError(null)

        try {
            const data = await createJob(prompt)
            if (data.success) {
                setGeneratedJob(data.job)
            } else {
                setError("Gagal menjana tugasan. Sila cuba lagi.")
            }
        } catch (err) {
            setError(err.message || "Ralat rangkaian. Pastikan backend berjalan.")
        } finally {
            setLoading(false)
        }
    }

    function handleReset() {
        setPrompt("")
        setGeneratedJob(null)
        setError(null)
        setLoading(false)
    }

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* Header */}
                <div className="mb-8 fade-in-up">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-bantu-dark leading-tight">
                        Apa yang anda <br className="sm:hidden" /> perlukan
                        <span className="text-bantu-orange flex items-center gap-2 mt-1">
                            bantuan hari ini? <i className="fa-solid fa-wand-magic-sparkles"></i>
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 font-medium">
                        Tulis je macam sembang dengan jiran.
                    </p>
                </div>

                {/* Two-column grid on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LEFT: Form */}
                    <div className="fade-in-up" style={{ animationDelay: "0.1s" }}>
                        <div className="relative w-full">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-48 sm:h-56 bg-gray-50 rounded-3xl p-5 text-base sm:text-lg outline-none border-2 border-transparent focus:border-bantu-orangeLight focus:bg-white focus:shadow-[0_0_20px_rgba(255,227,216,0.5)] transition-all resize-none font-medium text-gray-700"
                                placeholder="Contoh: Tolong angkat kotak berat petang ni. Upah RM20."
                            ></textarea>
                            <div className="absolute bottom-5 right-5 flex gap-2">
                                <button className="bg-white w-11 h-11 flex justify-center items-center rounded-full text-gray-400 hover:text-bantu-teal shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-90">
                                    <i className="fa-solid fa-camera"></i>
                                </button>
                                <button className="bg-white w-11 h-11 flex justify-center items-center rounded-full text-gray-400 hover:text-bantu-orange shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-90">
                                    <i className="fa-solid fa-microphone"></i>
                                </button>
                            </div>
                        </div>

                        {/* Loading indicator */}
                        {loading && (
                            <div className="mt-4 p-5 bg-gradient-to-r from-bantu-orangeLight/40 to-white rounded-2xl border border-bantu-orangeLight/50 animate-pulse">
                                <p className="text-xs text-bantu-orange font-bold uppercase flex items-center gap-2 mb-3">
                                    <i className="fa-solid fa-wand-magic-sparkles"></i> Gemini sedang mengekstrak...
                                </p>
                                <div className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm text-gray-700 inline-block border border-gray-100">
                                    <i className="fa-solid fa-gear fa-spin text-gray-400 mr-1"></i> Memproses entiti...
                                </div>
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-200 fade-in-up">
                                <p className="text-sm text-red-600 font-semibold flex items-center gap-2">
                                    <i className="fa-solid fa-circle-exclamation"></i> {error}
                                </p>
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            onClick={generatedJob ? handleReset : handleSubmit}
                            disabled={(prompt.length < 5 && !generatedJob) || loading}
                            className={`mt-6 w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-[0.98] shadow-soft disabled:opacity-40 disabled:cursor-not-allowed ${generatedJob
                                    ? "bg-bantu-orange hover:bg-[#ff5112] hover:shadow-xl shadow-glow"
                                    : "bg-bantu-dark hover:bg-black hover:shadow-xl"
                                }`}
                        >
                            {loading ? (
                                <span>
                                    <i className="fa-solid fa-spinner fa-spin mr-2"></i> Memproses dengan AI...
                                </span>
                            ) : generatedJob ? (
                                "Sahkan & Hantar Ke Peta ✨"
                            ) : (
                                "Jana Tugasan ✨"
                            )}
                        </button>
                    </div>

                    {/* RIGHT: Preview result */}
                    <div className="fade-in-up" style={{ animationDelay: "0.2s" }}>
                        {generatedJob ? (
                            <div className="p-6 bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100 shadow-soft fade-in-up">
                                <p className="text-[10px] tracking-wider text-bantu-teal font-extrabold uppercase mb-2">
                                    Tugasan Berjaya Disusun
                                </p>
                                <h3 className="font-extrabold text-xl text-gray-800 mb-2 tracking-tight">
                                    {generatedJob.job_type}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                    {generatedJob.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-green-600 border border-green-50 flex items-center gap-1">
                                        <i className="fa-solid fa-money-bill-wave"></i> RM {generatedJob.budget}
                                    </span>
                                    <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-bantu-teal border border-teal-50 flex items-center gap-1">
                                        <i className="fa-solid fa-tag"></i> {generatedJob.job_type}
                                    </span>
                                    {generatedJob.time && (
                                        <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-gray-600 border border-gray-100 flex items-center gap-1">
                                            <i className="fa-regular fa-clock"></i> {generatedJob.time}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex flex-col items-center justify-center h-full p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                                <i className="fa-solid fa-wand-magic-sparkles text-4xl text-gray-200 mb-4"></i>
                                <p className="text-gray-400 font-semibold text-sm">Pratonton tugasan akan muncul di sini</p>
                                <p className="text-gray-300 text-xs mt-1">Taip sesuatu dan tekan &quot;Jana Tugasan&quot;</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
