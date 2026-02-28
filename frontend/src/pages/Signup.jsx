import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function Signup({ onSwitch, onSuccess }) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        if (!name || !email || !password || !confirm) return setError("Sila isi semua ruangan.")
        if (password !== confirm) return setError("Kata laluan tidak sepadan.")
        if (password.length < 6) return setError("Kata laluan minimum 6 aksara.")
        setError("")
        setLoading(true)
        try {
            await register(email, password, name)
            onSuccess()
        } catch (err) {
            if (err.code === "auth/email-already-in-use") setError("Email sudah digunakan.")
            else if (err.code === "auth/weak-password") setError("Kata laluan terlalu lemah.")
            else setError(err.message)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-bantu-dark via-[#1e2328] to-[#0f1115] flex items-center justify-center px-4">
            <div className="w-full max-w-md fade-in-up">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Bantu<span className="text-bantu-orange">Now</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium mt-2">Komuniti Bantu Komuniti</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                    <h2 className="text-xl font-extrabold text-white mb-1">Daftar Akaun Baru ✨</h2>
                    <p className="text-gray-400 text-sm mb-6">Sertai komuniti BantuNow.</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-semibold flex items-center gap-2">
                            <i className="fa-solid fa-circle-exclamation"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Nama Penuh</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-bantu-orange/50 focus:bg-white/10 transition-all placeholder-gray-600"
                                placeholder="cth: Ahmad Shahmizan"
                            />
                        </div>
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
                                placeholder="Minimum 6 aksara"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Sahkan Kata Laluan</label>
                            <input
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-bantu-orange/50 focus:bg-white/10 transition-all placeholder-gray-600"
                                placeholder="Taip semula kata laluan"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-bantu-orange to-[#ff5112] text-white rounded-xl font-bold text-sm hover:shadow-glow active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                        >
                            {loading ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Mendaftar...</> : "Daftar Sekarang"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Sudah ada akaun?{" "}
                        <button onClick={onSwitch} className="text-bantu-orange font-bold hover:underline">
                            Log Masuk
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
