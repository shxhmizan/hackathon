import { useState, useEffect, useRef } from "react"
import { getJob, onMessagesSnapshot, sendMessage, completeJob, cancelJob } from "../services/api"
import { getCurrentUser } from "../services/user"

export default function MesejDetail({ jobId, chatId, onBack }) {
    const [job, setJob] = useState(null)
    const [messages, setMessages] = useState([])
    const [text, setText] = useState("")
    const [sending, setSending] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const scrollRef = useRef(null)
    const user = getCurrentUser()

    useEffect(() => {
        async function load() {
            const data = await getJob(jobId)
            setJob(data)
        }
        load()
    }, [jobId])

    useEffect(() => {
        if (!chatId) return
        const unsub = onMessagesSnapshot(chatId, (msgs) => {
            setMessages(msgs)
            setTimeout(() => {
                scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
            }, 100)
        })
        return () => unsub()
    }, [chatId])

    async function handleSend() {
        if (!text.trim() || sending) return
        setSending(true)
        const msg = text.trim()
        setText("")
        try {
            await sendMessage(chatId, user.id, msg)
        } catch (err) {
            console.error("Send failed:", err)
        }
        setSending(false)
    }

    async function handleComplete() {
        setActionLoading(true)
        try {
            await completeJob(jobId)
            setJob((prev) => ({ ...prev, status: "completed" }))
            await sendMessage(chatId, user.id, "✅ Tugasan telah diselesaikan!")
        } catch (err) {
            console.error("Complete failed:", err)
        }
        setActionLoading(false)
    }

    async function handleCancel() {
        if (!confirm("Pasti mahu batalkan tugasan?")) return
        setActionLoading(true)
        try {
            await cancelJob(jobId, chatId)
            if (onBack) onBack()
        } catch (err) {
            console.error("Cancel failed:", err)
        }
        setActionLoading(false)
    }

    const isOwner = job?.owner_id === user.id
    const isExecutor = job?.executor_id === user.id
    const isInProgress = job?.status === "in_progress"

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
        <div className="w-full min-h-screen flex flex-col bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm z-10 sticky top-0">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-400 hover:text-bantu-dark transition-colors active:scale-90">
                        <i className="fa-solid fa-arrow-left text-lg"></i>
                    </button>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-gray-800 truncate">{job?.title || job?.job_type || "Tugasan"}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${statusColors[job?.status] || ""}`}>
                                {statusLabels[job?.status] || "—"}
                            </span>
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${isOwner
                                    ? "bg-purple-50 text-purple-600 border border-purple-100"
                                    : "bg-blue-50 text-blue-600 border border-blue-100"
                                }`}>
                                {isOwner ? "Anda Pemilik" : "Anda Pelaksana"}
                            </span>
                        </div>
                    </div>
                    {job?.gaji && (
                        <span className="font-black text-bantu-orange text-lg">RM {job.gaji || job.budget}</span>
                    )}
                </div>
            </div>

            {/* Action Buttons (role-based) */}
            {isInProgress && (
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-3">
                    <div className="max-w-3xl mx-auto flex gap-3">
                        <button
                            onClick={handleComplete}
                            disabled={actionLoading}
                            className="flex-1 py-2.5 bg-gradient-to-r from-bantu-teal to-[#1ba89b] text-white rounded-xl text-xs font-bold hover:shadow-md active:scale-95 transition-all disabled:opacity-50"
                        >
                            <i className="fa-solid fa-check mr-1.5"></i> Selesai
                        </button>
                        {isOwner && (
                            <button
                                onClick={handleCancel}
                                disabled={actionLoading}
                                className="py-2.5 px-5 bg-red-50 text-red-500 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-100 active:scale-95 transition-all disabled:opacity-50"
                            >
                                <i className="fa-solid fa-xmark mr-1.5"></i> Batal
                            </button>
                        )}
                    </div>
                </div>
            )}

            {job?.status === "completed" && (
                <div className="bg-green-50 border-b border-green-100 px-4 py-3 text-center">
                    <p className="text-xs font-bold text-green-600">
                        <i className="fa-solid fa-circle-check mr-1"></i> Tugasan ini telah diselesaikan
                    </p>
                </div>
            )}

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 chat-bg">
                <div className="max-w-3xl mx-auto flex flex-col gap-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-300 py-16">
                            <i className="fa-solid fa-comments text-4xl mb-3"></i>
                            <p className="text-sm font-semibold">Belum ada mesej</p>
                        </div>
                    )}
                    {messages.map((msg) => {
                        const isMine = msg.sender_id === user.id
                        return (
                            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[75%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed ${isMine
                                            ? "bg-gradient-to-br from-bantu-orange to-[#ff5112] text-white rounded-br-sm shadow-md"
                                            : "bg-white border border-gray-100 text-gray-700 rounded-bl-sm shadow-sm"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
                <div className="max-w-3xl mx-auto flex items-center bg-gray-50 rounded-full p-1.5 border border-gray-200 focus-within:border-bantu-orange transition-colors">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Taip mesej..."
                        className="flex-1 bg-transparent px-4 outline-none text-sm font-medium"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!text.trim() || sending}
                        className="bg-bantu-orange text-white w-9 h-9 rounded-full flex justify-center items-center hover:bg-[#ff5112] active:scale-90 transition-all shadow-glow disabled:opacity-40"
                    >
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}
