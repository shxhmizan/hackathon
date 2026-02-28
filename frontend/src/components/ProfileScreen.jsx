import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../services/firebase"
import { seedDummyData } from "../utils/seedDummyData"

export default function ProfileScreen() {
    const { currentUser, logout } = useAuth()
    const [leaderboard, setLeaderboard] = useState([])
    const [myCompleted, setMyCompleted] = useState(0)
    const [loadingBoard, setLoadingBoard] = useState(true)
    const [seeding, setSeeding] = useState(false)
    const [seedResult, setSeedResult] = useState(null)

    const userName = currentUser?.displayName || "User"
    const userEmail = currentUser?.email || ""
    const uid = currentUser?.uid

    useEffect(() => {
        async function fetch() {
            try {
                const jobsSnap = await getDocs(collection(db, "jobs"))
                const all = jobsSnap.docs.map(d => d.data())
                const completed = all.filter(j => j.status === "completed")

                // Count by executor
                const counts = {}
                completed.forEach(j => { if (j.executor_id) counts[j.executor_id] = (counts[j.executor_id] || 0) + 1 })

                // My count
                setMyCompleted(counts[uid] || 0)

                // Users
                const usersSnap = await getDocs(collection(db, "users"))
                const usersMap = {}
                usersSnap.docs.forEach(d => { usersMap[d.id] = d.data() })

                const board = Object.entries(counts)
                    .map(([id, count]) => ({
                        id, name: usersMap[id]?.name || id,
                        avatar: usersMap[id]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
                        completed: count,
                    }))
                    .sort((a, b) => b.completed - a.completed)
                    .slice(0, 10)

                setLeaderboard(board)
            } catch (err) { console.error("Leaderboard:", err) }
            setLoadingBoard(false)
        }
        fetch()
    }, [uid])

    async function handleSeed() {
        setSeeding(true); setSeedResult(null)
        try { setSeedResult(await seedDummyData()) }
        catch (e) { setSeedResult({ message: "❌ " + e.message, skipped: true }) }
        setSeeding(false)
    }

    const medals = [
        { icon: "fa-crown", color: "text-yellow-500", bg: "bg-yellow-50" },
        { icon: "fa-medal", color: "text-gray-400", bg: "bg-gray-50" },
        { icon: "fa-medal", color: "text-amber-600", bg: "bg-amber-50" },
    ]

    return (
        <div className="w-full min-h-screen bg-bantu-gray overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-b from-bantu-dark to-[#0f1115] text-white p-6 pt-8 sm:p-8 sm:pt-10 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-soft relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full blur-xl -mr-10 -mt-10"></div>
                <div className="max-w-3xl mx-auto">
                    <div className="relative z-10 flex justify-between items-center mt-2 fade-in-up">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full border-[3px] border-bantu-orange shadow-glow" alt={userName} />
                                <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-400 to-orange-500 p-1.5 rounded-full border-2 border-[#0f1115]">
                                    <i className="fa-solid fa-star text-white text-[10px]"></i>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{userName}</h2>
                                <p className="text-xs text-gray-400 font-medium">{userEmail}</p>
                            </div>
                        </div>
                        <button onClick={logout} className="bg-white/10 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/20 transition-all active:scale-95 border border-white/10">
                            <i className="fa-solid fa-right-from-bracket mr-1.5"></i> Log Keluar
                        </button>
                    </div>

                    {/* Stats row */}
                    <div className="mt-6 grid grid-cols-2 gap-3 fade-in-up" style={{ animationDelay: "0.1s" }}>
                        <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Bantu Points</p>
                            <p className="text-2xl font-black text-white">1,250 <span className="text-sm text-gray-400">BP</span></p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Kerja Diselesaikan</p>
                            <p className="text-2xl font-black text-bantu-teal">{myCompleted} <span className="text-sm text-gray-400">tugas</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Seed button */}
                <div className="mt-6 fade-in-up" style={{ animationDelay: "0.15s" }}>
                    <button onClick={handleSeed} disabled={seeding} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl font-bold text-xs transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 border border-gray-200">
                        {seeding ? <><i className="fa-solid fa-spinner fa-spin"></i> Menjana...</> : <><i className="fa-solid fa-database"></i> Seed Demo Data</>}
                    </button>
                    {seedResult && <p className={`mt-2 text-center text-xs font-semibold ${seedResult.skipped ? "text-yellow-600" : "text-green-600"}`}>{seedResult.message}</p>}
                </div>

                {/* Leaderboard */}
                <div className="mt-6 mb-8 fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <h3 className="font-extrabold text-bantu-dark text-lg mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-trophy text-yellow-500"></i> Wira Lokal — Top 10
                    </h3>

                    {loadingBoard ? (
                        <div className="text-center py-10"><i className="fa-solid fa-spinner fa-spin text-xl text-bantu-orange"></i></div>
                    ) : leaderboard.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                            <i className="fa-solid fa-users text-3xl text-gray-200 mb-3"></i>
                            <p className="text-gray-400 font-semibold text-sm">Tiada data lagi</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                            {leaderboard.map((u, i) => {
                                const isMe = uid && u.id === uid
                                const isTop3 = i < 3
                                return (
                                    <div key={u.id} className={`flex items-center justify-between p-4 transition-colors ${isMe ? "bg-gradient-to-r from-orange-50 to-white border-l-4 border-bantu-orange"
                                            : isTop3 ? `${medals[i].bg} border-l-4 border-transparent`
                                                : i < leaderboard.length - 1 ? "border-b border-gray-50 hover:bg-gray-50" : "hover:bg-gray-50"
                                        }`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 text-center">
                                                {isTop3 ? <i className={`fa-solid ${medals[i].icon} ${medals[i].color} text-lg drop-shadow-sm`}></i>
                                                    : <span className="font-black text-gray-300 text-sm">#{i + 1}</span>}
                                            </div>
                                            <img src={u.avatar} className={`w-10 h-10 bg-gray-100 rounded-full ${isMe ? "border-2 border-bantu-orange shadow-sm" : "border border-gray-200"}`} alt={u.name} />
                                            <span className={`font-bold text-sm ${isMe ? "text-bantu-orange font-extrabold" : "text-gray-800"}`}>
                                                {u.name} {isMe && <span className="text-[10px] text-gray-400">(Anda)</span>}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-black px-3 py-1 rounded-lg ${isMe ? "bg-bantu-orange text-white shadow-sm" : isTop3 ? "bg-white text-gray-600 shadow-sm border border-gray-100" : "bg-gray-100 text-gray-500"}`}>
                                            {u.completed} <i className="fa-solid fa-check-circle ml-1"></i>
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Dompet */}
                <div className="mb-24 md:mb-8 fade-in-up" style={{ animationDelay: "0.3s" }}>
                    <h3 className="font-extrabold text-bantu-dark text-lg mb-4 flex items-center gap-2"><i className="fa-solid fa-wallet text-bantu-teal"></i> Dompet</h3>
                    <div className="bg-gradient-to-br from-[#1E232A] to-[#2c333d] rounded-2xl p-6 text-white shadow-soft border border-gray-800 relative overflow-hidden">
                        <i className="fa-solid fa-wallet absolute -right-4 -bottom-4 text-8xl text-white opacity-5"></i>
                        <p className="text-[11px] text-gray-400 mb-1 font-bold uppercase">Baki Boleh Keluar</p>
                        <h2 className="text-3xl font-black mb-5">RM 125<span className="text-xl text-gray-400">.00</span></h2>
                        <div className="flex gap-3 relative z-10">
                            <button className="flex-1 bg-white text-bantu-dark py-3.5 rounded-xl font-extrabold text-sm active:scale-95 transition-all">Keluarkan</button>
                            <button className="flex-1 bg-white/10 border border-white/20 text-white py-3.5 rounded-xl font-extrabold text-sm active:scale-95 transition-all">Topup</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
