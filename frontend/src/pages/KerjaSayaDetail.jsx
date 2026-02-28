import { useState, useEffect } from "react"
import { getJob, acceptJob } from "../services/api"
import { getCurrentUser } from "../services/user"
import { useUserLocation, jobDistance, formatDist } from "../utils/geo"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../services/firebase"

function cleanPhone(n) { return n ? n.replace(/[\s\-()]/g, "") : "" }

function Confetti({ show }) {
    if (!show) return null
    const colors = ["#FF6B35", "#2EC4B6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"]
    const pcs = Array.from({ length: 50 }, (_, i) => ({ id: i, l: Math.random() * 100, d: Math.random() * 0.5, c: colors[i % 6], s: Math.random() * 6 + 4, t: Math.random() * 1.5 + 1.5 }))
    return (<div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
        {pcs.map(p => (<div key={p.id} className="absolute confetti-piece" style={{ left: `${p.l}%`, top: "-10px", width: `${p.s}px`, height: `${p.s * 1.5}px`, background: p.c, borderRadius: "2px", animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }} />))}
    </div>)
}

function ConfirmModal({ show, onConfirm, onCancel }) {
    if (!show) return null
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm fade-in-up px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-check-circle text-green-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-extrabold text-bantu-dark mb-2">Kerja Selesai?</h3>
            <p className="text-gray-500 text-sm mb-6">Adakah anda pasti kerja telah diselesaikan?</p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm active:scale-95 transition-all">Batal</button>
                <button onClick={onConfirm} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-all">Ya, Selesai!</button>
            </div>
        </div>
    </div>)
}

export default function KerjaSayaDetail({ jobId, onBack, onGoToMap, onGoToKerjaSaya }) {
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [accepting, setAccepting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [completing, setCompleting] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const user = getCurrentUser()
    const userLoc = useUserLocation()

    useEffect(() => { getJob(jobId).then(d => { setJob(d); setLoading(false) }) }, [jobId])

    async function handleAccept() {
        setAccepting(true)
        try { await acceptJob(jobId, user.id); onGoToKerjaSaya?.() }
        catch { alert("Gagal terima tugas."); setAccepting(false) }
    }

    async function handleComplete() {
        setCompleting(true)
        try {
            await updateDoc(doc(db, "jobs", jobId), { status: "completed", completed_at: serverTimestamp() })
            setShowConfirm(false); setShowConfetti(true)
            setTimeout(() => { setShowConfetti(false); onGoToKerjaSaya?.() }, 2500)
        } catch { alert("Gagal."); setCompleting(false) }
    }

    if (loading) return <div className="w-full min-h-screen bg-white flex items-center justify-center"><i className="fa-solid fa-spinner fa-spin text-3xl text-bantu-orange"></i></div>
    if (!job) return <div className="w-full min-h-screen bg-white flex items-center justify-center"><p className="text-gray-500 font-semibold">Tugasan tidak dijumpai</p></div>

    const isOwner = job.owner_id === user.id, isExec = job.executor_id === user.id
    const phone = cleanPhone(job.contact_no), dist = formatDist(jobDistance(userLoc, job))
    const prog = { open: 25, in_progress: 70, completed: 100 }[job.status] || 0
    const progClr = job.status === "completed" ? "from-green-400 to-green-500" : job.status === "in_progress" ? "from-orange-400 to-bantu-orange" : "from-blue-400 to-blue-500"
    const sLbl = { open: "Terbuka", in_progress: "Sedang Berjalan", completed: "Selesai" }
    const sClr = { open: "bg-green-100 text-green-700 border-green-200", in_progress: "bg-orange-100 text-orange-700 border-orange-200", completed: "bg-gray-100 text-gray-500 border-gray-200" }

    return (<div className="w-full min-h-screen bg-white">
        <Confetti show={showConfetti} />
        <ConfirmModal show={showConfirm} onConfirm={handleComplete} onCancel={() => setShowConfirm(false)} />
        {showConfetti && <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-white/80 backdrop-blur-sm"><div className="text-center fade-in-up"><div className="text-6xl mb-4">🎉</div><h2 className="text-2xl font-extrabold text-bantu-dark">Tahniah!</h2><p className="text-gray-500 mt-2">Tugasan berjaya diselesaikan</p></div></div>}

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-bantu-dark font-bold text-sm mb-6 transition-colors active:scale-95"><i className="fa-solid fa-arrow-left"></i> Kembali</button>

            {/* Progress */}
            <div className="mb-6 fade-in-up">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progres Tugasan</span>
                    <span className="text-xs font-black text-gray-600">{prog}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className={`bg-gradient-to-r ${progClr} h-full rounded-full transition-all duration-700 relative`} style={{ width: `${prog}%` }}>
                        {prog < 100 && <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/30 animate-pulse rounded-full"></div>}
                    </div>
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase mt-1.5">
                    <span className={prog >= 25 ? "text-bantu-orange" : ""}>Terbuka</span>
                    <span className={prog >= 70 ? "text-bantu-orange" : ""}>Berjalan</span>
                    <span className={prog >= 100 ? "text-green-500" : ""}>Selesai</span>
                </div>
            </div>

            {job.image_url && <div className="rounded-2xl overflow-hidden mb-6 shadow-soft"><img src={job.image_url} alt={job.title} className="w-full h-48 sm:h-64 object-cover" /></div>}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-lg border ${sClr[job.status]}`}>{sLbl[job.status]}</span>
                {job.job_type && <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-lg bg-teal-50 text-bantu-teal border border-teal-100">{job.job_type}</span>}
                <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-lg ${isOwner ? "bg-purple-50 text-purple-600 border border-purple-100" : isExec ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-gray-50 text-gray-500 border border-gray-100"}`}>{isOwner ? "Anda Pemberi Kerja" : isExec ? "Anda Pelaksana" : "Pelawat"}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-bantu-dark mb-2">{job.title || job.job_type || "Tugasan"}</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{job.description}</p>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-2xl border border-orange-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Gaji</p>
                    <p className="text-2xl font-black text-bantu-orange">RM {job.gaji || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-white p-4 rounded-2xl border border-teal-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pemilik</p>
                    <p className="text-sm font-bold text-gray-700">{job.owner_name || "Anonim"}</p>
                </div>
                {job.contact_no && <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Telefon</p>
                    <p className="text-sm font-bold text-gray-700"><i className="fa-solid fa-phone text-green-500 mr-2"></i>{job.contact_no}</p>
                </div>}
                {dist && <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Jarak</p>
                    <p className="text-sm font-bold text-blue-600"><i className="fa-solid fa-location-dot mr-2"></i>{dist} dari anda</p>
                </div>}
            </div>

            {/* Call/WA */}
            {isExec && phone && job.status === "in_progress" && <div className="grid grid-cols-2 gap-3 mb-6">
                <a href={`tel:+6${phone}`} className="flex items-center justify-center gap-2 py-3.5 bg-green-500 text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-all shadow-sm"><i className="fa-solid fa-phone"></i> Call</a>
                <a href={`https://wa.me/6${phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-all shadow-sm"><i className="fa-brands fa-whatsapp text-lg"></i> WhatsApp</a>
            </div>}

            {/* Actions */}
            <div className="space-y-3">
                {job.status === "open" && !isOwner && <button onClick={handleAccept} disabled={accepting} className="w-full py-4 bg-gradient-to-r from-bantu-teal to-[#1ba89b] text-white rounded-2xl font-bold text-base active:scale-[0.98] transition-all shadow-soft disabled:opacity-50">{accepting ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Memproses...</> : <>TERIMA TUGAS <i className="fa-solid fa-handshake ml-2"></i></>}</button>}
                {job.status === "in_progress" && isExec && <button onClick={() => setShowConfirm(true)} disabled={completing} className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-base active:scale-[0.98] transition-all shadow-soft disabled:opacity-50"><i className="fa-solid fa-check-double mr-2"></i>KERJA SELESAI</button>}
                {job.status === "in_progress" && <button onClick={onGoToMap} className="w-full py-4 bg-bantu-dark text-white rounded-2xl font-bold text-base active:scale-[0.98] transition-all shadow-soft"><i className="fa-solid fa-map mr-2"></i>Kembali ke Peta</button>}
                {job.status === "completed" && <div className="w-full p-4 bg-green-50 rounded-2xl border border-green-200 text-center"><p className="text-sm font-bold text-green-600"><i className="fa-solid fa-check-circle mr-2"></i>Tugasan telah selesai</p></div>}
            </div>
        </div>
    </div>)
}
