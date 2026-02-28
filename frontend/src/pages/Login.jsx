import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function Login({ onSwitch, onSuccess }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        if (!email || !password) return setError("Sila isi semua ruangan.")
        setError("")
        setLoading(true)
        try {
            await login(email, password)
            onSuccess()
        } catch (err) {
            if (err.code === "auth/user-not-found") setError("Akaun tidak dijumpai.")
            else if (err.code === "auth/wrong-password") setError("Kata laluan salah.")
            else if (err.code === "auth/invalid-credential") setError("Email atau kata laluan salah.")
            else setError(err.message)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-bantu-dark via-[#1e2328] to-[#0f1115] flex items-center justify-center px-4">
            <div className="w-full max-w-md fade-in-up">
                {/* Logo */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Bantu<span className="text-bantu-orange">Now</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium mt-2">Komuniti Bantu Komuniti</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                    <h2 className="text-xl font-extrabold text-white mb-1">Selamat Kembali 👋</h2>
                    <p className="text-gray-400 text-sm mb-6">Log masuk ke akaun anda.</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-semibold flex items-center gap-2">
                            <i className="fa-solid fa-circle-exclamation"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-bantu-orange/50 focus:bg-white/10 transition-all placeholder-gray-600"
                                placeholder="anda@email.com"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Kata Laluan</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-bantu-orange/50 focus:bg-white/10 transition-all placeholder-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-bantu-orange to-[#ff5112] text-white rounded-xl font-bold text-sm hover:shadow-glow active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                        >
                            {loading ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Memproses...</> : "Log Masuk"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Belum ada akaun?{" "}
                        <button onClick={onSwitch} className="text-bantu-orange font-bold hover:underline">
                            Daftar Sekarang
                        </button>
                    </p>
                </div>

                {/* Demo hint */}
                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <p className="text-[11px] text-gray-500 font-medium">
                        <i className="fa-solid fa-lightbulb text-yellow-500 mr-1"></i>
                        Demo: <span className="text-gray-400">demo@bantunow.com</span> / <span className="text-gray-400">demo123</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
