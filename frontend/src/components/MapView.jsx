import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { onJobsSnapshot } from "../services/api"

// Static job data (fallback when Firestore has no data)
const staticJobLocations = [
    { lat: 3.1415, lng: 101.6932, title: "Pasang Meja IKEA", cat: "Pertukangan", price: 25, loc: "Kuala Lumpur", dist: "1.2km" },
    { lat: 5.4141, lng: 100.3288, title: "Cuci Kereta", cat: "Pembersihan", price: 15, loc: "Pulau Pinang", dist: "800m" },
    { lat: 1.4927, lng: 103.7414, title: "Beli Barang Dapur", cat: "Penghantaran", price: 20, loc: "Johor Bahru", dist: "2.1km" },
    { lat: 4.5975, lng: 101.0901, title: "Baiki Paip Bocor", cat: "Baik Pulih", price: 50, loc: "Ipoh", dist: "5km" },
    { lat: 3.8077, lng: 103.3260, title: "Angkat Kotak", cat: "Buruh Kasar", price: 30, loc: "Kuantan", dist: "3.5km" },
    { lat: 1.5533, lng: 110.3592, title: "Kemas Laman", cat: "Pembersihan", price: 40, loc: "Kuching", dist: "1km" },
    { lat: 5.9788, lng: 116.0753, title: "Hantar Dokumen", cat: "Penghantaran", price: 10, loc: "Kota Kinabalu", dist: "900m" },
    { lat: 2.1896, lng: 102.2501, title: "Cat Dinding Bilik", cat: "Pertukangan", price: 80, loc: "Melaka", dist: "4km" },
    { lat: 6.1248, lng: 100.3678, title: "Baiki Basikal", cat: "Baik Pulih", price: 25, loc: "Alor Setar", dist: "2.8km" },
    { lat: 5.3117, lng: 103.1324, title: "Tarik Kereta", cat: "Bantuan Kecemasan", price: 100, loc: "K. Terengganu", dist: "6km" },
]

// Custom marker icon
const bantuIcon = L.divIcon({
    className: "custom-div-icon",
    html: `
    <div style="position:relative;display:flex;justify-content:center;align-items:center;">
      <div style="position:absolute;width:100%;height:100%;border-radius:50%;background:#FF6B35;opacity:0.4;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
      <div style="position:relative;display:flex;justify-content:center;align-items:center;background:linear-gradient(135deg,#FF6B35,#e04e1b);width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.15);z-index:10;">
        <i class="fa-solid fa-briefcase" style="color:white;font-size:11px;"></i>
      </div>
    </div>
  `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -15],
})

// Firestore job marker icon (different color to distinguish)
const liveIcon = L.divIcon({
    className: "custom-div-icon",
    html: `
    <div style="position:relative;display:flex;justify-content:center;align-items:center;">
      <div style="position:absolute;width:100%;height:100%;border-radius:50%;background:#2EC4B6;opacity:0.4;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
      <div style="position:relative;display:flex;justify-content:center;align-items:center;background:linear-gradient(135deg,#2EC4B6,#1ba89b);width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.15);z-index:10;">
        <i class="fa-solid fa-bolt" style="color:white;font-size:11px;"></i>
      </div>
    </div>
  `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -15],
})

// Heatmap layer component
function HeatmapLayer({ jobs }) {
    const map = useMap()

    useEffect(() => {
        if (typeof L.heatLayer !== "function") return

        const allJobs = [...staticJobLocations, ...jobs]
        const heatData = allJobs.map((job) => [
            job.lat || job.latitude || 0,
            job.lng || job.longitude || 0,
            0.8,
        ])

        const heat = L.heatLayer(heatData, {
            radius: 50,
            blur: 40,
            maxZoom: 15,
            gradient: { 0.4: "#ffe3d8", 0.7: "#FFB085", 1.0: "#FF6B35" },
        }).addTo(map)

        return () => {
            map.removeLayer(heat)
        }
    }, [map, jobs])

    return null
}

export default function MapView() {
    const [liveJobs, setLiveJobs] = useState([])

    // Subscribe to Firestore jobs collection
    useEffect(() => {
        const unsubscribe = onJobsSnapshot((jobs) => {
            setLiveJobs(jobs)
        })

        // Cleanup listener on unmount
        return () => unsubscribe()
    }, [])

    return (
        <div className="absolute inset-0 z-0">
            <MapContainer
                center={[4.2105, 101.9758]}
                zoom={6}
                zoomControl={false}
                className="w-full h-full"
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer
                    attribution="&copy; CARTO"
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                <HeatmapLayer jobs={liveJobs} />

                {/* Static markers */}
                {staticJobLocations.map((job, index) => (
                    <Marker key={`static-${index}`} position={[job.lat, job.lng]} icon={bantuIcon}>
                        <Popup>
                            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                <span style={{
                                    fontSize: "9px", fontWeight: 800, color: "#2EC4B6",
                                    background: "#f0fdfa", padding: "4px 10px", borderRadius: "6px",
                                    textTransform: "uppercase", letterSpacing: "0.05em",
                                    display: "inline-block", border: "1px solid #ccfbf1"
                                }}>
                                    {job.cat}
                                </span>
                                <h3 style={{ fontWeight: 800, color: "#1f2937", marginTop: "10px", fontSize: "16px", lineHeight: 1.3 }}>
                                    {job.title}
                                </h3>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", marginBottom: "8px" }}>
                                    <p style={{ color: "#FF6B35", fontWeight: 900, fontSize: "20px", letterSpacing: "-0.025em" }}>
                                        RM {job.price}
                                    </p>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ fontSize: "10px", fontWeight: 700, color: "#1f2937" }}>
                                            <i className="fa-solid fa-location-dot" style={{ color: "#FF6B35", marginRight: "4px" }}></i>
                                            {job.loc}
                                        </p>
                                        <p style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 600, marginTop: "2px" }}>
                                            {job.dist} dari anda
                                        </p>
                                    </div>
                                </div>
                                <button style={{
                                    marginTop: "8px", width: "100%",
                                    background: "linear-gradient(to right, #1A1D21, #2c333d)",
                                    color: "white", fontSize: "12px", fontWeight: 700,
                                    padding: "10px 0", borderRadius: "12px", border: "none", cursor: "pointer"
                                }}>
                                    Terima Tugas
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Live Firestore markers */}
                {liveJobs.map((job) => (
                    <Marker
                        key={`live-${job.id}`}
                        position={[job.latitude || 3.14, job.longitude || 101.69]}
                        icon={liveIcon}
                    >
                        <Popup>
                            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                                    <span style={{
                                        fontSize: "9px", fontWeight: 800, color: "#2EC4B6",
                                        background: "#f0fdfa", padding: "4px 10px", borderRadius: "6px",
                                        textTransform: "uppercase", letterSpacing: "0.05em",
                                        display: "inline-block", border: "1px solid #ccfbf1"
                                    }}>
                                        {job.job_type || "Tugasan"}
                                    </span>
                                    <span style={{
                                        fontSize: "9px", fontWeight: 800, color: "#FF6B35",
                                        background: "#fff7ed", padding: "4px 10px", borderRadius: "6px",
                                        textTransform: "uppercase", letterSpacing: "0.05em",
                                        display: "inline-block", border: "1px solid #ffe3d8"
                                    }}>
                                        LIVE
                                    </span>
                                </div>
                                <h3 style={{ fontWeight: 800, color: "#1f2937", fontSize: "16px", lineHeight: 1.3 }}>
                                    {job.description || job.job_type || "Tugasan Baru"}
                                </h3>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", marginBottom: "8px" }}>
                                    <p style={{ color: "#FF6B35", fontWeight: 900, fontSize: "20px", letterSpacing: "-0.025em" }}>
                                        RM {job.budget || 0}
                                    </p>
                                    {job.time && (
                                        <p style={{ fontSize: "10px", fontWeight: 600, color: "#9ca3af" }}>
                                            <i className="fa-regular fa-clock" style={{ marginRight: "4px" }}></i>
                                            {job.time}
                                        </p>
                                    )}
                                </div>
                                <button style={{
                                    marginTop: "8px", width: "100%",
                                    background: "linear-gradient(to right, #2EC4B6, #1ba89b)",
                                    color: "white", fontSize: "12px", fontWeight: 700,
                                    padding: "10px 0", borderRadius: "12px", border: "none", cursor: "pointer"
                                }}>
                                    Terima Tugas
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
