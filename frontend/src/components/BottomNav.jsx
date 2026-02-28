export default function BottomNav({ activeTab, setActiveTab }) {
    const tabs = [
        { id: "home", icon: "fa-map-location-dot", label: "PETA" },
        { id: "bagikerja", icon: "fa-briefcase", label: "BAGI KERJA" },
        { id: "bantubot", icon: "fa-robot", label: "BANTUBOT", isCenter: true },
        { id: "kerjasaya", icon: "fa-clipboard-list", label: "KERJA SAYA" },
        { id: "profile", icon: "fa-user", label: "PROFIL" },
    ]

    return (
        <>
            {/* MOBILE: Fixed bottom bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl border-t border-white/50 flex justify-around items-center py-3 px-2 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:hidden">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id || (tab.id === "kerjasaya" && activeTab === "kerja-detail")

                    if (tab.isCenter) {
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="flex flex-col items-center gap-1 transition-all relative group active:scale-95"
                            >
                                <div
                                    className={
                                        isActive
                                            ? "bg-gradient-to-br from-bantu-orange to-[#ff5112] text-white p-3.5 rounded-full -mt-8 shadow-glow border-[6px] border-white transition-all duration-300"
                                            : "bg-gray-100 text-gray-400 p-3.5 rounded-full -mt-8 shadow-md border-[6px] border-white transition-all duration-300 group-hover:shadow-lg"
                                    }
                                >
                                    <i className={`fa-solid ${tab.icon} text-xl`}></i>
                                </div>
                            </button>
                        )
                    }

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center gap-1 transition-all active:scale-90 relative ${isActive ? "text-bantu-orange" : "text-gray-400 hover:text-bantu-dark"
                                }`}
                        >
                            <i className={`fa-solid ${tab.icon} text-lg ${isActive ? "drop-shadow-sm" : ""}`}></i>
                            <span className="text-[7px] font-extrabold tracking-wider leading-tight">{tab.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* DESKTOP: Sidebar */}
            <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-gray-100 min-h-screen sticky top-0 shadow-sm">
                <div className="p-6 pb-4 border-b border-gray-50">
                    <h1 className="text-2xl font-extrabold text-bantu-dark tracking-tight">
                        Bantu<span className="text-bantu-orange">Now</span>
                    </h1>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">Platform Tugasan Jiran</p>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-1">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id || (tab.id === "kerjasaya" && activeTab === "kerja-detail")
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all text-left w-full group ${isActive
                                        ? tab.isCenter
                                            ? "bg-gradient-to-r from-bantu-orange to-[#ff5112] text-white shadow-glow"
                                            : "bg-orange-50 text-bantu-orange shadow-sm border border-orange-100/50"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    }`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isActive
                                        ? tab.isCenter ? "bg-white/20" : "bg-bantu-orange/10"
                                        : "bg-gray-100 group-hover:bg-gray-200"
                                    }`}>
                                    <i className={`fa-solid ${tab.icon} text-sm`}></i>
                                </div>
                                <span className="font-bold text-sm">{tab.label}</span>
                            </button>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer w-full text-left"
                    >
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User`}
                            className="w-10 h-10 bg-white rounded-full border-2 border-bantu-orange shadow-sm flex-shrink-0"
                            alt="User"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-800 truncate">Profil Saya</p>
                            <p className="text-[10px] text-gray-400 font-medium">Lihat profil</p>
                        </div>
                        <i className="fa-solid fa-chevron-right text-gray-300 text-xs flex-shrink-0"></i>
                    </button>
                </div>
            </aside>
        </>
    )
}
