import MapView from "../components/MapView"

export default function Home() {
    return (
        <div className="relative w-full min-h-screen">
            <MapView />

            {/* Top overlay: Logo (mobile only) + Search */}
            <div className="absolute top-0 w-full p-4 sm:p-6 pt-6 sm:pt-8 bg-gradient-to-b from-white/90 via-white/50 to-transparent z-10 pointer-events-none">
                {/* Logo - mobile only (desktop has it in sidebar) */}
                <div
                    className="flex justify-between items-center mb-4 pointer-events-auto fade-in-up md:hidden"
                    style={{ animationDelay: "0.1s" }}
                >
                    <h1 className="text-2xl font-extrabold text-bantu-dark tracking-tight drop-shadow-sm">
                        Bantu<span className="text-bantu-orange">Now</span>
                    </h1>
                    <div className="bg-white/90 backdrop-blur-sm p-2 w-11 h-11 flex justify-center items-center rounded-full shadow-sm border border-gray-100 cursor-pointer text-gray-600 hover:text-bantu-orange hover:shadow-md transition-all active:scale-95">
                        <i className="fa-solid fa-sliders"></i>
                    </div>
                </div>

                {/* Search bar */}
                <div
                    className="max-w-xl bg-white/80 backdrop-blur-md rounded-full flex items-center px-5 py-3.5 shadow-soft border border-white/50 pointer-events-auto fade-in-up transition-all hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-bantu-orange/30"
                    style={{ animationDelay: "0.2s" }}
                >
                    <i className="fa-solid fa-magnifying-glass text-gray-400 mr-3"></i>
                    <input
                        type="text"
                        placeholder="Cari kerja berdekatan..."
                        className="bg-transparent outline-none w-full text-sm font-medium text-gray-700 placeholder-gray-400"
                    />
                    {/* Desktop filter button */}
                    <button className="hidden md:flex ml-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors text-gray-500">
                        <i className="fa-solid fa-sliders text-sm"></i>
                    </button>
                </div>
            </div>

            {/* Bottom hint */}
            <div className="absolute bottom-24 md:bottom-8 w-full px-6 z-10 flex justify-center pointer-events-none">
                <span className="bg-bantu-dark/80 text-white text-[11px] font-medium px-4 py-2 rounded-full backdrop-blur-md shadow-lg flex items-center gap-2 animate-bounce">
                    <i className="fa-solid fa-hand-pointer text-bantu-orangeLight"></i> Zoom & klik pin untuk tugasan
                </span>
            </div>
        </div>
    )
}
