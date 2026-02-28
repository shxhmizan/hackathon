import { useState, useEffect } from "react"
import { onChatsSnapshot, getJob } from "../services/api"
import { getCurrentUser } from "../services/user"

export default function Mesej({ onOpenChat }) {
    const [chats, setChats] = useState([])
    const [jobsMap, setJobsMap] = useState({})
    const [loading, setLoading] = useState(true)
    const user = getCurrentUser()

    useEffect(() => {
        const unsub = onChatsSnapshot(user.id, async (chatList) => {
            setChats(chatList)

            // Fetch job details for each chat
            const jobs = {}
            for (const chat of chatList) {
                if (!jobsMap[chat.job_id]) {
                    const job = await getJob(chat.job_id)
                    if (job) jobs[chat.job_id] = job
                }
            }
            setJobsMap((prev) => ({ ...prev, ...jobs }))
            setLoading(false)
        })
        return () => unsub()
    }, [])

    const statusColors = {
        open: "bg-green-100 text-green-700",
        in_progress: "bg-orange-100 text-orange-700",
        completed: "bg-gray-100 text-gray-500",
    }

    const statusLabels = {
        open: "Terbuka",
        in_progress: "Berjalan",
        completed: "Selesai",
    }

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <div className="mb-8 fade-in-up">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-bantu-dark leading-tight">
                        Mesej
                        <span className="text-bantu-orange flex items-center gap-2 mt-1">
                            Perbualan Tugasan <i className="fa-solid fa-comment-dots"></i>
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 font-medium">
                        Semua perbualan tugasan anda.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <i className="fa-solid fa-spinner fa-spin text-2xl text-bantu-orange mb-3"></i>
                        <p className="text-gray-400 font-semibold text-sm">Memuatkan perbualan...</p>
                    </div>
                ) : chats.length === 0 ? (
                    <div className="text-center py-16 fade-in-up">
                        <i className="fa-solid fa-comment-slash text-5xl text-gray-200 mb-4"></i>
                        <p className="text-gray-400 font-semibold">Tiada perbualan lagi</p>
                        <p className="text-gray-300 text-xs mt-1">Terima tugasan untuk bermula!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {chats.map((chat, i) => {
                            const job = jobsMap[chat.job_id]
                            const isOwner = chat.owner_id === user.id
                            const otherName = isOwner ? "Pelaksana" : (job?.owner_name || "Pemilik")

                            return (
                                <button
                                    key={chat.id}
                                    onClick={() => onOpenChat(chat.job_id, chat.id)}
                                    className="w-full text-left p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-bantu-orangeLight transition-all active:scale-[0.98] fade-in-up"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherName}`}
                                            className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0"
                                            alt={otherName}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h4 className="font-extrabold text-gray-800 text-sm truncate">
                                                    {job?.title || job?.job_type || "Tugasan"}
                                                </h4>
                                                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${statusColors[job?.status] || "bg-gray-100 text-gray-400"}`}>
                                                    {statusLabels[job?.status] || "—"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${isOwner
                                                        ? "bg-purple-50 text-purple-600 border border-purple-100"
                                                        : "bg-blue-50 text-blue-600 border border-blue-100"
                                                    }`}>
                                                    {isOwner ? "Anda Pemilik" : "Anda Pelaksana"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate font-medium">
                                                {chat.last_message || "..."}
                                            </p>
                                        </div>
                                        <i className="fa-solid fa-chevron-right text-gray-300 text-xs mt-1 flex-shrink-0"></i>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
