import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { onAllJobsSnapshot } from "../services/api"
import { jobDistance, formatDist } from "../utils/geo"

function makeIcon(color, icon = "fa-briefcase") {
    const colors = {
        green: { bg: "#22c55e" },
        orange: { bg: "#FF6B35" },
    }
    const c = colors[color] || colors.green
    return L.divIcon({
        className: "custom-div-icon",
        html: `
      <div style="position:relative;display:flex;justify-content:center;align-items:center;">
        <div style="position:absolute;width:100%;height:100%;border-radius:50%;background:${c.bg};opacity:0.4;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="position:relative;display:flex;justify-content:center;align-items:center;background:${c.bg};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.15);z-index:10;">
          <i class="fa-solid ${icon}" style="color:white;font-size:11px;"></i>
        </div>
      </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -15],
    })
}

const statusIcon = {
    open: makeIcon("green", "fa-briefcase"),
    in_progress: makeIcon("orange", "fa-clock"),
}

function HeatmapLayer({ jobs, show }) {
    const map = useMap()
    useEffect(() => {
        if (!show || typeof L.heatLayer !== "function") return
        const heatData = jobs
            .filter((j) => j.location)
            .map((j) => [j.location.lat, j.location.lng, j.status === "open" ? 1 : 0.7])
        if (heatData.length === 0) return
        const heat = L.heatLayer(heatData, {
            radius: 50, blur: 40, maxZoom: 15,
            gradient: { 0.4: "#ffe3d8", 0.7: "#FFB085", 1.0: "#FF6B35" },
        }).addTo(map)
        return () => map.removeLayer(heat)
    }, [map, jobs, show])
    return null
}

export default function MapView({ onJobSelect, showHeatmap, userLoc }) {
    const [jobs, setJobs] = useState([])

    useEffect(() => {
        const unsub = onAllJobsSnapshot((allJobs) => {
            setJobs(allJobs.filter((j) => j.status !== "completed"))
        })
        return () => unsub()
    }, [])

    const statusLabels = { open: "Terbuka", in_progress: "Berjalan" }

    return (
        <div className="absolute inset-0 z-0">
            <MapContainer
                center={[3.1390, 101.6869]}
                zoom={10}
                zoomControl={false}
                className="w-full h-full"
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer
                    attribution="&copy; CARTO"
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <HeatmapLayer jobs={jobs} show={showHeatmap} />

                {!showHeatmap && jobs.map((job) => {
                    if (!job.location) return null
                    const icon = statusIcon[job.status] || statusIcon.open
                    const dist = jobDistance(userLoc, job)
                    const distStr = formatDist(dist)

                    return (
                        <Marker key={job.id} position={[job.location.lat, job.location.lng]} icon={icon}>
                            <Popup>
                                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                                        <span style={{
                                            fontSize: "9px", fontWeight: 800,
                                            color: job.status === "open" ? "#22c55e" : "#FF6B35",
                                            background: job.status === "open" ? "#f0fdf4" : "#fff7ed",
                                            padding: "4px 10px", borderRadius: "6px",
                                            textTransform: "uppercase", letterSpacing: "0.05em",
                                            border: `1px solid ${job.status === "open" ? "#bbf7d0" : "#ffe3d8"}`
                                        }}>
                                            {statusLabels[job.status]}
                                        </span>
                                        {job.job_type && (
                                            <span style={{
                                                fontSize: "9px", fontWeight: 800, color: "#2EC4B6",
                                                background: "#f0fdfa", padding: "4px 10px", borderRadius: "6px",
                                                textTransform: "uppercase", border: "1px solid #ccfbf1"
                                            }}>
                                                {job.job_type}
                                            </span>
                                        )}
                                    </div>
                                    <h3 style={{ fontWeight: 800, color: "#1f2937", fontSize: "16px", lineHeight: 1.3 }}>
                                        {job.title || job.job_type || "Tugasan"}
                                    </h3>
                                    {job.description && (
                                        <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "6px", lineHeight: 1.4 }}>
                                            {job.description.substring(0, 80)}{job.description.length > 80 ? "..." : ""}
                                        </p>
                                    )}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", marginBottom: "8px" }}>
                                        <p style={{ color: "#FF6B35", fontWeight: 900, fontSize: "20px" }}>
                                            RM {job.gaji || job.budget || 0}
                                        </p>
                                        {distStr && (
                                            <span style={{ fontSize: "10px", fontWeight: 700, color: "#6b7280", background: "#f3f4f6", padding: "3px 8px", borderRadius: "8px" }}>
                                                📍 {distStr}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => onJobSelect && onJobSelect(job.id)}
                                        style={{
                                            marginTop: "4px", width: "100%",
                                            background: job.status === "open" ? "linear-gradient(to right, #22c55e, #16a34a)" : "linear-gradient(to right, #1A1D21, #2c333d)",
                                            color: "white", fontSize: "12px", fontWeight: 700,
                                            padding: "10px 0", borderRadius: "12px", border: "none", cursor: "pointer"
                                        }}
                                    >
                                        {job.status === "open" ? "Lihat & Terima" : "Lihat Butiran"}
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}
