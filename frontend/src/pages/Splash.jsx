import { useState, useEffect } from "react"

export default function Splash({ onFinish }) {
    const [fadeOut, setFadeOut] = useState(false)

    useEffect(() => {
        const timer1 = setTimeout(() => setFadeOut(true), 1800)
        const timer2 = setTimeout(() => onFinish(), 2200)
        return () => { clearTimeout(timer1); clearTimeout(timer2) }
    }, [onFinish])

    return (
        <div className={`min-h-screen w-full bg-gradient-to-br from-bantu-dark via-[#1e2328] to-[#0f1115] flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
            {/* Animated glow ring */}
            <div className="relative mb-8">
                <div className="absolute inset-0 w-28 h-28 bg-bantu-orange/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-28 h-28 bg-gradient-to-br from-bantu-orange to-[#ff5112] rounded-3xl flex items-center justify-center shadow-glow rotate-12 hover:rotate-0 transition-transform duration-500">
                    <span className="text-white text-4xl font-black -rotate-12">B</span>
                </div>
            </div>

            {/* Logo */}
            <h1 className="text-5xl font-black text-white tracking-tight mb-3 fade-in-up">
                Bantu<span className="text-bantu-orange">Now</span>
            </h1>
            <p className="text-gray-500 text-sm font-semibold tracking-widest uppercase fade-in-up" style={{ animationDelay: "0.2s" }}>
                Komuniti Bantu Komuniti
            </p>

            {/* Spinner */}
            <div className="mt-12 fade-in-up" style={{ animationDelay: "0.4s" }}>
                <div className="w-8 h-8 border-3 border-gray-700 border-t-bantu-orange rounded-full animate-spin"></div>
            </div>

            {/* Bottom text */}
            <p className="absolute bottom-8 text-[10px] text-gray-600 font-medium tracking-wider fade-in-up" style={{ animationDelay: "0.6s" }}>
                POWERED BY GEMINI AI
            </p>
        </div>
    )
}
