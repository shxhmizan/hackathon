export default function ChatScreen() {
    return (
        <div className="w-full min-h-screen chat-bg flex flex-col">
            {/* Header */}
            <div className="pt-6 sm:pt-8 pb-4 px-4 sm:px-6 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm z-10 flex items-center justify-between sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jiran"
                            className="w-11 h-11 bg-gray-100 rounded-full border-2 border-white shadow-sm"
                            alt="Jiran"
                        />
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                        <h2 className="font-extrabold text-gray-800 text-lg leading-tight">Jason (Jiran)</h2>
                        <p className="text-[11px] text-bantu-teal font-semibold">Tugas: Pasang Meja IKEA</p>
                    </div>
                </div>
                <div className="flex gap-3 text-gray-400">
                    <i className="fa-solid fa-phone cursor-pointer hover:text-bantu-orange transition-colors"></i>
                    <i className="fa-solid fa-ellipsis-vertical cursor-pointer hover:text-bantu-dark transition-colors"></i>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5 max-w-3xl w-full mx-auto">
                <div className="bg-yellow-50/80 border border-yellow-200 text-yellow-700 text-[10px] p-2.5 rounded-xl text-center font-bold shadow-sm backdrop-blur-sm mx-4 fade-in-up">
                    <i className="fa-solid fa-triangle-exclamation mr-1"></i> AMARAN: Perbualan ini mengandungi &quot;trolling manglish sentence&quot;.
                </div>

                {/* Message from Jiran */}
                <div className="flex gap-2 items-end fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jiran"
                        className="w-8 h-8 rounded-full bg-white shadow-sm mb-1"
                        alt="Jiran"
                    />
                    <div className="bg-white border border-gray-100 p-3.5 rounded-2xl rounded-bl-sm shadow-sm text-sm text-gray-700 max-w-[75%] font-medium leading-relaxed">
                        Weh bro, u can tolong I carry this almari or not? Berat gila siot, my back adoi pecah liao. 😩
                    </div>
                </div>

                {/* Message from user */}
                <div className="flex gap-2 items-end justify-end fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <div className="bg-gradient-to-br from-bantu-orange to-[#ff5112] p-3.5 rounded-2xl rounded-br-sm shadow-md text-sm text-white max-w-[75%] font-medium leading-relaxed">
                        Boleh boss, give me 5 mins I fly there. U pay me extra ringgit ok? 💸🚀
                    </div>
                </div>

                {/* Message from Jiran */}
                <div className="flex gap-2 items-end fade-in-up" style={{ animationDelay: "0.3s" }}>
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jiran"
                        className="w-8 h-8 rounded-full bg-white shadow-sm mb-1"
                        alt="Jiran"
                    />
                    <div className="bg-white border border-gray-100 p-3.5 rounded-2xl rounded-bl-sm shadow-sm text-sm text-gray-700 max-w-[75%] font-medium leading-relaxed">
                        Cincai lah, janji you tolong settle. Trolling manglish sentence confirm ada. Hahaha! 😂
                    </div>
                </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 sticky bottom-0 md:bottom-0">
                <div className="max-w-3xl mx-auto flex items-center bg-white rounded-full p-1.5 shadow-sm border border-gray-200 focus-within:border-bantu-orange transition-colors">
                    <button className="text-gray-400 hover:text-bantu-teal px-3 active:scale-90 transition-transform">
                        <i className="fa-solid fa-paperclip"></i>
                    </button>
                    <input
                        type="text"
                        placeholder="Taip mesej..."
                        className="flex-1 bg-transparent px-2 outline-none text-sm font-medium"
                    />
                    <button className="bg-bantu-orange text-white w-9 h-9 rounded-full flex justify-center items-center hover:bg-[#ff5112] active:scale-90 transition-all shadow-glow">
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}
