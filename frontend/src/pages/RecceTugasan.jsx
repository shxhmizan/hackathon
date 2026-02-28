import { useState, useEffect } from "react"
import { getJob, acceptJob, createChat } from "../services/api"
import { getCurrentUser } from "../services/user"

export default function RecceTugasan({ jobId, onBack, onChatOpen }) {
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [accepting, setAccepting] = useState(false)
    const user = getCurrentUser()

    useEffect(() => {
        async function load() {
            const data = await getJob(jobId)
            setJob(data)
            setLoading(false)
        }
        load()
    }, [jobId])

    async function handleAccept() {
        setAccepting(true)
        try {
            await acceptJob(jobId, user.id)
            await createChat(jobId, job.owner_id, user.id)
            if (onChatOpen) onChatOpen(jobId)
        } catch (err) {
            console.error("Accept failed:", err)
            alert("Gagal terima tugas.")
            setAccepting(false)
        }
    }

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <i className="fa-solid fa-spinner fa-spin text-3xl text-bantu-orange mb-3"></i>
                    <p className="text-gray-400 font-semibold text-sm">Memuatkan...</p>
                </div>
            </div>
        )
    }

    if (!job) {
        return (
            <div className="w-full min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <i className="fa-solid fa-circle-exclamation text-3xl text-red-400 mb-3"></i>
                    <p className="text-gray-500 font-semibold">Tugasan tidak dijumpai</p>
                    <button onClick={onBack} className="mt-4 text-bantu-orange font-bold text-sm hover:underline">
                        ← Kembali ke peta
                    </button>
                </div>
            </div>
        )
    }

    const statusColors = {
        open: "bg-green-100 text-green-700 border-green-200",
        in_progress: "bg-orange-100 text-orange-700 border-orange-200",
        completed: "bg-gray-100 text-gray-500 border-gray-200",
    }

    const statusLabels = {
        open: "Terbuka",
        in_progress: "Sedang Berjalan",
        completed: "Selesai",
    }

    const isOwner = job.owner_id === user.id
    const isExecutor = job.executor_id === user.id

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Back button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-bantu-dark font-bold text-sm mb-6 transition-colors active:scale-95"
                >
                    <i className="fa-solid fa-arrow-left"></i> Kembali ke peta
                </button>

                {/* Image */}
                {job.image_url && (
                    <div className="rounded-2xl overflow-hidden mb-6 shadow-soft fade-in-up">
                        <img src={job.image_url} alt={job.title} className="w-full h-48 sm:h-64 object-cover" />
                    </div>
                )}

                {/* Header */}
                <div className="fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg border ${statusColors[job.status]}`}>
                            {statusLabels[job.status]}
                        </span>
                        {job.job_type && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg bg-teal-50 text-bantu-teal border border-teal-100">
                                {job.job_type}
                            </span>
                        )}
                        {isOwner && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
                                Anda Pemilik
                            </span>
                        )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-bantu-dark leading-tight mb-2">
                        {job.title || job.job_type || "Tugasan"}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        {job.description}
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6 fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-2xl border border-orange-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Gaji</p>
                        <p className="text-2xl font-black text-bantu-orange">RM {job.gaji || job.budget || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-white p-4 rounded-2xl border border-teal-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pemilik</p>
                        <p className="text-sm font-bold text-gray-700">{job.owner_name || "Anonim"}</p>
                    </div>
                    {job.contact_no && (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Telefon</p>
                            <p className="text-sm font-bold text-gray-700"><i className="fa-solid fa-phone text-green-500 mr-2"></i>{job.contact_no}</p>
                        </div>
                    )}
                    {job.location && (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Lokasi</p>
                            <p className="text-xs font-mono text-gray-500">{job.location.lat?.toFixed(4)}, {job.location.lng?.toFixed(4)}</p>
                        </div>
                    )}
                </div>

                {/* Accept Button */}
                {job.status === "open" && !isOwner && (
                    <button
                        onClick={handleAccept}
                        disabled={accepting}
                        className="w-full py-4 bg-gradient-to-r from-bantu-teal to-[#1ba89b] text-white rounded-2xl font-bold text-base hover:shadow-xl active:scale-[0.98] transition-all shadow-soft disabled:opacity-50 fade-in-up"
                        style={{ animationDelay: "0.3s" }}
                    >
                        {accepting ? (
                            <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Memproses...</>
                        ) : (
                            <>TERIMA TUGAS <i className="fa-solid fa-handshake ml-2"></i></>
                        )}
                    </button>
                )}

                {/* Already accepted notification */}
                {job.status === "in_progress" && isExecutor && (
                    <div className="w-full p-4 bg-orange-50 rounded-2xl border border-orange-200 text-center fade-in-up">
                        <p className="text-sm font-bold text-orange-600">
                            <i className="fa-solid fa-circle-info mr-2"></i>
                            Anda sudah terima tugas ini
                        </p>
                        <button
                            onClick={() => onChatOpen && onChatOpen(jobId)}
                            className="mt-3 text-sm font-bold text-bantu-orange hover:underline"
                        >
                            Buka Chat →
                        </button>
                    </div>
                )}

                {job.status === "completed" && (
                    <div className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center fade-in-up">
                        <p className="text-sm font-bold text-gray-400">
                            <i className="fa-solid fa-check-circle mr-2"></i> Tugasan ini telah selesai
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
