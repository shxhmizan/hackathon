import { useState, useEffect } from "react"
import { onAllJobsSnapshot } from "../services/api"
import { getCurrentUser } from "../services/user"
import { useUserLocation, jobDistance, formatDist } from "../utils/geo"

export default function KerjaSaya({ onOpenDetail }) {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const user = getCurrentUser()
    const userLoc = useUserLocation()

    useEffect(() => {
        const unsub = onAllJobsSnapshot((allJobs) => {
            const myJobs = allJobs.filter(
                (j) => j.owner_id === user.id || j.executor_id === user.id
            )
            setJobs(myJobs)
            setLoading(false)
        })
        return () => unsub()
    }, [])

    const inProgress = jobs.filter((j) => j.status === "in_progress")
    const completed = jobs.filter((j) => j.status === "completed")

    const statusColors = {
        open: "bg-green-100 text-green-700 border-green-200",
        in_progress: "bg-orange-100 text-orange-700 border-orange-200",
        completed: "bg-gray-100 text-gray-500 border-gray-200",
    }
    const statusLabels = {
        open: "Terbuka",
        in_progress: "Sedang Berjalan",
        completed: "Selesai",
    }

    function JobCard({ job, index }) {
        const isOwner = job.owner_id === user.id
        const dist = jobDistance(userLoc, job)
        const distStr = formatDist(dist)

        return (
            <button
                onClick={() => onOpenDetail(job.id)}
                className="w-full text-left p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-bantu-orangeLight transition-all active:scale-[0.98] fade-in-up"
                style={{ animationDelay: `${index * 0.04}s` }}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${statusColors[job.status]}`}>
                                {statusLabels[job.status]}
                            </span>
                            {job.job_type && (
                                <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-teal-50 text-bantu-teal border border-teal-100">
                                    {job.job_type}
                                </span>
                            )}
                            <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-md ${isOwner ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                                }`}>
                                {isOwner ? "Anda Pemberi Kerja" : "Anda Pelaksana"}
                            </span>
                        </div>
                        <h4 className="font-extrabold text-gray-800 text-sm truncate">
                            {job.title || job.job_type || "Tugasan"}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                            {job.description && (
                                <p className="text-xs text-gray-400 truncate flex-1">{job.description}</p>
                            )}
                            {distStr && (
                                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md flex-shrink-0">
                                    📍 {distStr}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                        <span className="font-black text-bantu-orange text-lg">RM {job.gaji || job.budget || 0}</span>
                        <i className="fa-solid fa-chevron-right text-gray-300 text-xs mt-2"></i>
                    </div>
                </div>
            </button>
        )
    }

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <div className="mb-8 fade-in-up">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-bantu-dark leading-tight">
                        Kerja Saya
                        <span className="text-bantu-orange flex items-center gap-2 mt-1">
                            Dashboard Tugasan <i className="fa-solid fa-clipboard-list"></i>
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 font-medium">
                        Semua tugasan berkaitan anda.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <i className="fa-solid fa-spinner fa-spin text-2xl text-bantu-orange mb-3"></i>
                        <p className="text-gray-400 font-semibold text-sm">Memuatkan tugasan...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-16 fade-in-up">
                        <i className="fa-solid fa-folder-open text-5xl text-gray-200 mb-4"></i>
                        <p className="text-gray-400 font-semibold">Tiada tugasan lagi</p>
                        <p className="text-gray-300 text-xs mt-1">Terima atau cipta tugasan untuk bermula!</p>
                    </div>
                ) : (
                    <>
                        {inProgress.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse"></div>
                                    <h3 className="font-extrabold text-gray-700 text-sm uppercase tracking-wider">
                                        Sedang Berjalan ({inProgress.length})
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {inProgress.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
                                </div>
                            </div>
                        )}
                        {completed.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                    <h3 className="font-extrabold text-gray-700 text-sm uppercase tracking-wider">
                                        Selesai ({completed.length})
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {completed.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
