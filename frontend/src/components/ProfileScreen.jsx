import { useState } from "react"

export default function ProfileScreen() {
    const [dashTab, setDashTab] = useState("tugasan")

    const tabBtnBase = "flex-1 flex flex-col items-center py-3.5 gap-1.5 rounded-xl transition-all active:scale-95"
    const tabBtnActive = "bg-orange-50/50 text-bantu-orange shadow-sm border border-orange-100/50"
    const tabBtnInactive = "text-gray-400 hover:text-gray-600"

    return (
        <div className="w-full min-h-screen bg-bantu-gray overflow-y-auto">
            {/* Profile Header */}
            <div className="bg-gradient-to-b from-bantu-dark to-[#0f1115] text-white p-6 pt-8 sm:p-8 sm:pt-10 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-soft relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full blur-xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-bantu-orange opacity-10 rounded-full blur-2xl -ml-8 -mb-8"></div>

                <div className="max-w-3xl mx-auto">
                    <div className="relative z-10 flex justify-between items-center mt-2 fade-in-up">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shahmizan"
                                    className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full border-[3px] border-bantu-orange shadow-glow"
                                    alt="Shahmizan"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-400 to-orange-500 p-1.5 rounded-full border-2 border-[#0f1115] shadow-sm">
                                    <i className="fa-solid fa-star text-white text-[10px]"></i>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Shahmizan</h2>
                                <p className="text-xs text-bantu-orangeLight font-semibold">Lvl 5: Jiran Harapan</p>
                            </div>
                        </div>
                        <div className="bg-white/10 p-2.5 rounded-2xl flex flex-col items-center backdrop-blur-md border border-white/10 px-4 cursor-pointer hover:bg-white/20 transition-colors active:scale-95">
                            <i className="fa-solid fa-fire text-orange-400 text-xl animate-pulse"></i>
                            <span className="font-extrabold text-lg mt-0.5 leading-none">
                                7<span className="text-[10px] font-normal ml-1">Hari</span>
                            </span>
                        </div>
                    </div>

                    <div
                        className="mt-6 sm:mt-8 bg-white/5 rounded-2xl p-4 flex justify-between items-center backdrop-blur-md border border-white/10 fade-in-up"
                        style={{ animationDelay: "0.1s" }}
                    >
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Bantu Points</p>
                            <p className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                                1,250 <span className="text-sm font-semibold text-gray-400">BP</span>
                            </p>
                        </div>
                        <button className="bg-gradient-to-r from-bantu-orange to-[#ff5112] text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-glow hover:shadow-lg transition-all active:scale-95">
                            Tebus
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Dashboard Tabs */}
                <div
                    className="flex justify-around bg-white mt-6 rounded-2xl p-1.5 shadow-soft border border-gray-50 fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                >
                    <button
                        onClick={() => setDashTab("tugasan")}
                        className={`${tabBtnBase} ${dashTab === "tugasan" ? tabBtnActive : tabBtnInactive}`}
                    >
                        <i className="fa-solid fa-bullseye text-lg"></i>
                        <span className="text-[11px] font-extrabold">Tugasan</span>
                    </button>
                    <button
                        onClick={() => setDashTab("dompet")}
                        className={`${tabBtnBase} ${dashTab === "dompet" ? tabBtnActive : tabBtnInactive}`}
                    >
                        <i className="fa-solid fa-wallet text-lg"></i>
                        <span className="text-[11px] font-bold">Dompet</span>
                    </button>
                    <button
                        onClick={() => setDashTab("wira")}
                        className={`${tabBtnBase} ${dashTab === "wira" ? tabBtnActive : tabBtnInactive}`}
                    >
                        <i className="fa-solid fa-trophy text-lg"></i>
                        <span className="text-[11px] font-bold">Wira Lokal</span>
                    </button>
                </div>

                {/* Dashboard Content */}
                <div className="py-5 pb-24 md:pb-8">
                    {/* Tugasan Tab */}
                    {dashTab === "tugasan" && (
                        <div className="fade-in-up">
                            <div className="bg-white rounded-[1.5rem] p-5 shadow-soft border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[9px] font-extrabold text-bantu-teal bg-teal-50 px-2.5 py-1 rounded-md uppercase tracking-wider mb-2 block w-fit border border-teal-100">
                                            Sedang Berjalan
                                        </span>
                                        <h4 className="font-extrabold text-gray-800 text-lg leading-tight">Beli Barang Dapur</h4>
                                    </div>
                                    <span className="font-black text-bantu-teal bg-teal-50 px-3 py-1.5 rounded-xl text-sm border border-teal-100">
                                        RM 15
                                    </span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mb-5 gap-2 font-semibold">
                                    <i className="fa-regular fa-clock text-orange-400"></i> Due: Hari ini, 5:00 PM
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2.5 overflow-hidden">
                                    <div className="bg-gradient-to-r from-bantu-teal to-teal-400 h-full rounded-full w-[60%] relative">
                                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    <span>Mula</span>
                                    <span className="text-bantu-teal">Jalan</span>
                                    <span>Siap</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dompet Tab */}
                    {dashTab === "dompet" && (
                        <div className="fade-in-up">
                            <div className="bg-gradient-to-br from-[#1E232A] to-[#2c333d] rounded-[1.5rem] p-6 text-white shadow-soft border border-gray-800 mb-5 relative overflow-hidden">
                                <i className="fa-solid fa-wallet absolute -right-4 -bottom-4 text-8xl text-white opacity-5"></i>
                                <p className="text-[11px] text-gray-400 mb-1 font-bold uppercase tracking-wider">Baki Boleh Keluar</p>
                                <h2 className="text-3xl sm:text-4xl font-black mb-5 tracking-tight text-white">
                                    RM 125<span className="text-xl text-gray-400 font-bold">.00</span>
                                </h2>
                                <div className="flex gap-3 relative z-10">
                                    <button className="flex-1 bg-white text-bantu-dark py-3.5 rounded-xl font-extrabold text-sm hover:bg-gray-100 active:scale-95 transition-all shadow-sm">
                                        Keluarkan
                                    </button>
                                    <button className="flex-1 bg-white/10 border border-white/20 text-white py-3.5 rounded-xl font-extrabold text-sm hover:bg-white/20 active:scale-95 transition-all backdrop-blur-sm">
                                        Topup
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Wira Lokal Tab */}
                    {dashTab === "wira" && (
                        <div className="fade-in-up">
                            <div className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 p-2 overflow-hidden">
                                <div className="flex items-center justify-between p-4 rounded-2xl mb-1 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-xl w-6 text-center text-yellow-500 drop-shadow-sm">#1</span>
                                        <img
                                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=AmirIzzat"
                                            className="w-11 h-11 bg-gray-100 rounded-full border border-gray-200"
                                            alt="Amir Izzat"
                                        />
                                        <span className="font-bold text-gray-800">Amir Izzat</span>
                                    </div>
                                    <span className="text-xs font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">2,450 BP</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl mb-1 bg-gradient-to-r from-orange-50 to-white border border-orange-100 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-xl w-6 text-center text-gray-400">#2</span>
                                        <img
                                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shahmizan"
                                            className="w-11 h-11 bg-white rounded-full border-[2px] border-bantu-orange shadow-sm"
                                            alt="Shahmizan"
                                        />
                                        <span className="font-extrabold text-bantu-orange">Shahmizan (Anda)</span>
                                    </div>
                                    <span className="text-xs font-black text-white bg-bantu-orange px-3 py-1 rounded-lg shadow-sm">
                                        1,250 BP
                                    </span>
                                </div>
                            </div>
                            <div className="mt-5 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 text-center">
                                <p className="text-xs text-bantu-orange font-semibold">
                                    Selesaikan 2 lagi tugas untuk pintas <span className="font-extrabold">Amir Izzat</span>! 🔥
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
