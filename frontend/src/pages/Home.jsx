import { useState, useEffect } from "react"
import MapView from "../components/MapView"
import { onAllJobsSnapshot } from "../services/api"
import { useUserLocation, analyzeNearbyJobs } from "../utils/geo"

export default function Home({ onJobSelect, showHeatmap, setShowHeatmap }) {
    const [allJobs, setAllJobs] = useState([])
    const userLoc = useUserLocation()

    useEffect(() => {
        const unsub = onAllJobsSnapshot((jobs) => setAllJobs(jobs))
        return () => unsub()
    }, [])

    const stats = {
        total: allJobs.length,
        open: allJobs.filter((j) => j.status === "open").length,
        in_progress: allJobs.filter((j) => j.status === "in_progress").length,
        completed: allJobs.filter((j) => j.status === "completed").length,
    }

    const insights = analyzeNearbyJobs(userLoc, allJobs, 10)

    return (
        <div className="relative w-full min-h-screen">
            <MapView onJobSelect={onJobSelect} showHeatmap={showHeatmap} userLoc={userLoc} />

            {/* Top overlay */}
            <div className="absolute top-0 w-full p-4 sm:p-6 pt-6 sm:pt-8 bg-gradient-to-b from-white/90 via-white/50 to-transparent z-10 pointer-events-none">
                <div
                    className="flex justify-between items-center mb-4 pointer-events-auto fade-in-up md:hidden"
                    style={{ animationDelay: "0.1s" }}
                >
                    <h1 className="text-2xl font-extrabold text-bantu-dark tracking-tight drop-shadow-sm">
                        Bantu<span className="text-bantu-orange">Now</span>
                    </h1>
                    <div className="bg-white/90 backdrop-blur-sm p-2 w-11 h-11 flex justify-center items-center rounded-full shadow-sm border border-gray-100 cursor-pointer text-gray-600">
                        <i className="fa-solid fa-sliders"></i>
                    </div>
                </div>

                <div
                    className="max-w-xl bg-white/80 backdrop-blur-md rounded-full flex items-center px-5 py-3.5 shadow-soft border border-white/50 pointer-events-auto fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                >
                    <i className="fa-solid fa-magnifying-glass text-gray-400 mr-3"></i>
                    <input
                        type="text"
                        placeholder="Cari kerja berdekatan..."
                        className="bg-transparent outline-none w-full text-sm font-medium text-gray-700 placeholder-gray-400"
                    />
                </div>

                {/* Stats cards */}
                {stats.total > 0 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pointer-events-auto fade-in-up" style={{ animationDelay: "0.3s" }}>
                        <div className="flex-shrink-0 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/50 shadow-sm flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                                <i className="fa-solid fa-briefcase text-blue-500 text-[10px]"></i>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Jumlah</p>
                                <p className="text-sm font-black text-gray-800">{stats.total}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/50 shadow-sm flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                                <i className="fa-solid fa-circle text-green-500 text-[8px]"></i>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Terbuka</p>
                                <p className="text-sm font-black text-green-600">{stats.open}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/50 shadow-sm flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                                <i className="fa-solid fa-clock text-orange-500 text-[10px]"></i>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Berjalan</p>
                                <p className="text-sm font-black text-orange-600">{stats.in_progress}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/50 shadow-sm flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                                <i className="fa-solid fa-check text-gray-400 text-[10px]"></i>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Selesai</p>
                                <p className="text-sm font-black text-gray-500">{stats.completed}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Smart Insight Banner */}
                {userLoc && (
                    <div className="mt-3 pointer-events-auto fade-in-up" style={{ animationDelay: "0.4s" }}>
                        <div className="bg-gradient-to-r from-bantu-dark to-[#2c333d] rounded-2xl p-4 shadow-lg border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-bantu-orange/20 flex items-center justify-center flex-shrink-0">
                                    <i className="fa-solid fa-brain text-bantu-orange"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                                        <i className="fa-solid fa-sparkles text-yellow-400 mr-1"></i> Insight Pintar
                                    </p>
                                    <p className="text-white text-sm font-bold leading-snug">
                                        {insights.mostPopular
                                            ? `Jenis kerja paling aktif berhampiran anda hari ini: ${insights.mostPopular}`
                                            : "Tiada kerja aktif berhampiran anda sekarang."}
                                    </p>
                                </div>
                            </div>

                            {/* Fun Facts */}
                            {insights.activeCount > 0 && (
                                <div className="flex gap-2 mt-3">
                                    <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center border border-white/5">
                                        <p className="text-lg font-black text-white">{insights.activeCount}</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase">Aktif 10km</p>
                                    </div>
                                    <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center border border-white/5">
                                        <p className="text-lg font-black text-bantu-orange">RM {insights.avgPay}</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase">Purata</p>
                                    </div>
                                    <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center border border-white/5">
                                        <p className="text-xs font-black text-bantu-teal leading-tight mt-0.5">{insights.mostPopular || "—"}</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">Popular</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-24 md:bottom-8 w-full px-6 z-10 flex justify-center items-center gap-3 pointer-events-none">
                <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`pointer-events-auto px-4 py-2.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg transition-all active:scale-95 border ${showHeatmap
                            ? "bg-bantu-orange text-white border-bantu-orange shadow-glow"
                            : "bg-white/90 text-gray-600 border-white/50 hover:bg-white"
                        }`}
                >
                    <i className={`fa-solid fa-fire mr-1.5 ${showHeatmap ? "animate-pulse" : ""}`}></i>
                    Titik Panas
                </button>
                <span className="bg-bantu-dark/80 text-white text-[11px] font-medium px-4 py-2 rounded-full backdrop-blur-md shadow-lg flex items-center gap-2 pointer-events-none">
                    <i className="fa-solid fa-hand-pointer text-bantu-orangeLight"></i> Klik pin untuk tugasan
                </span>
            </div>
        </div>
    )
}
