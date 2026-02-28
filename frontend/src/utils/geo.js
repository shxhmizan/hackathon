import { useState, useEffect } from "react"

// Haversine formula — returns distance in km
export function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Format distance nicely
export function formatDist(km) {
    if (km == null) return null
    if (km < 1) return `${Math.round(km * 1000)}m`
    return `${km.toFixed(1)} km`
}

// Hook: get user location
export function useUserLocation() {
    const [loc, setLoc] = useState(null)

    useEffect(() => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition(
            (pos) => setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => {
                // Fallback to KL center for demo
                setLoc({ lat: 3.1390, lng: 101.6869 })
            },
            { enableHighAccuracy: false, timeout: 5000 }
        )
    }, [])

    return loc
}

// Get distance between user and a job
export function jobDistance(userLoc, job) {
    if (!userLoc || !job?.location) return null
    return haversineKm(userLoc.lat, userLoc.lng, job.location.lat, job.location.lng)
}

// Analyze jobs within radius
export function analyzeNearbyJobs(userLoc, jobs, radiusKm = 10) {
    if (!userLoc) return { nearby: [], mostPopular: null, avgPay: 0, activeCount: 0 }

    const nearby = jobs.filter((j) => {
        if (!j.location) return false
        return haversineKm(userLoc.lat, userLoc.lng, j.location.lat, j.location.lng) <= radiusKm
    })

    const openNearby = nearby.filter((j) => j.status === "open")

    // Most popular job type
    const typeCounts = {}
    openNearby.forEach((j) => {
        if (j.job_type) typeCounts[j.job_type] = (typeCounts[j.job_type] || 0) + 1
    })
    const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])
    const mostPopular = sorted.length > 0 ? sorted[0][0] : null

    // Average pay
    const pays = openNearby.filter((j) => j.gaji || j.budget).map((j) => j.gaji || j.budget || 0)
    const avgPay = pays.length > 0 ? Math.round(pays.reduce((a, b) => a + b, 0) / pays.length) : 0

    return {
        nearby,
        mostPopular,
        avgPay,
        activeCount: openNearby.length,
    }
}
