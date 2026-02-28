import { useState, useRef, useEffect } from "react"
import { sendBantuBot } from "../services/api"
import { getCurrentUser } from "../services/user"

export default function BantuBot() {
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            role: "bot",
            text: "Assalamualaikum! 👋 Saya BantuBot.\n\nSaya boleh bantu anda:\n• Cari kerja berdekatan 💰\n• Buat tugasan baru 📝\n• Jawab soalan am ❓\n\nApa yang anda perlukan?",
        },
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef(null)
    const user = getCurrentUser()

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, [messages])

    async function handleSend() {
        if (!input.trim() || loading) return
        const userMsg = input.trim()
        setInput("")

        setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: userMsg }])
        setLoading(true)

        try {
            // Get user location for job search
            let location = null
            try {
                const pos = await new Promise((resolve, reject) =>
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
                )
                location = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            } catch {
                location = { lat: 3.1415, lng: 101.6932 }
            }

            const res = await sendBantuBot(userMsg, user.id, location)

            if (res.intent === "earn_money" && res.jobs) {
                const jobList = res.jobs
                    .map((j, i) => `${i + 1}. **${j.title || j.job_type}** — RM${j.gaji || j.budget}\n   📍 ${j.distance || "berdekatan"}`)
                    .join("\n\n")

                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        role: "bot",
                        text: `🔍 Saya jumpa ${res.jobs.length} tugasan berdekatan:\n\n${jobList}\n\nNak terima yang mana? Taip nombor!`,
                    },
                ])
            } else if (res.intent === "post_job" && res.job) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        role: "bot",
                        text: `📝 Saya dah cipta tugasan:\n\n**${res.job.title || res.job.job_type}**\nGaji: RM${res.job.gaji || res.job.budget}\nJenis: ${res.job.job_type}\n\n${res.saved ? "✅ Disimpan ke peta!" : "Ada maklumat lain yang perlu ditambah?"}`,
                    },
                ])
            } else {
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now(), role: "bot", text: res.reply || res.text || "Maaf, saya tak faham. Cuba lagi?" },
                ])
            }
        } catch (err) {
            console.error("BantuBot error:", err)
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    role: "bot",
                    text: "❌ Maaf, saya tak dapat proses sekarang. Backend mungkin belum aktif.\n\nPastikan backend berjalan di port 3000.",
                },
            ])
        }
        setLoading(false)
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-bantu-dark to-[#2c333d] text-white px-4 sm:px-6 py-5 shadow-md z-10 sticky top-0">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <div className="bg-gradient-to-br from-bantu-orange to-[#ff5112] p-3 rounded-2xl shadow-glow">
                        <i className="fa-solid fa-robot text-xl"></i>
                    </div>
                    <div>
                        <h2 className="font-extrabold text-lg tracking-tight">BantuBot</h2>
                        <p className="text-[11px] text-gray-400 font-medium">Pembantu AI Pintar Anda</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-green-400 font-bold">AKTIF</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 chat-bg">
                <div className="max-w-3xl mx-auto flex flex-col gap-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} fade-in-up`}>
                            {msg.role === "bot" && (
                                <div className="w-8 h-8 bg-bantu-orange rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1 shadow-sm">
                                    <i className="fa-solid fa-robot text-white text-xs"></i>
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed whitespace-pre-line ${msg.role === "user"
                                        ? "bg-gradient-to-br from-bantu-orange to-[#ff5112] text-white rounded-br-sm shadow-md"
                                        : "bg-white border border-gray-100 text-gray-700 rounded-bl-sm shadow-sm"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-center gap-2 fade-in-up">
                            <div className="w-8 h-8 bg-bantu-orange rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                <i className="fa-solid fa-robot text-white text-xs"></i>
                            </div>
                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-sm shadow-sm">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 bg-white border-t border-gray-50">
                <div className="max-w-3xl mx-auto flex gap-2 py-3 overflow-x-auto">
                    {["Cari kerja dekat sini", "Saya nak buat tugasan", "Apa itu BantuNow?"].map((q) => (
                        <button
                            key={q}
                            onClick={() => { setInput(q); }}
                            className="whitespace-nowrap px-4 py-2 bg-gray-50 hover:bg-orange-50 text-xs font-bold text-gray-500 hover:text-bantu-orange rounded-full border border-gray-100 hover:border-orange-200 transition-all active:scale-95 flex-shrink-0"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
                <div className="max-w-3xl mx-auto flex items-center bg-gray-50 rounded-full p-1.5 border border-gray-200 focus-within:border-bantu-orange transition-colors">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Tanya BantuBot apa sahaja..."
                        className="flex-1 bg-transparent px-4 outline-none text-sm font-medium"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="bg-bantu-orange text-white w-9 h-9 rounded-full flex justify-center items-center hover:bg-[#ff5112] active:scale-90 transition-all shadow-glow disabled:opacity-40"
                    >
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}
