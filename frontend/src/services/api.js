import { initializeApp } from "firebase/app"
import { getFirestore, collection, onSnapshot, query, where } from "firebase/firestore"

// Firebase client config for project: bantu-now
const firebaseConfig = {
    apiKey: "AIzaSyDummy-replace-with-real-key",
    authDomain: "bantu-now.firebaseapp.com",
    projectId: "bantu-now",
    storageBucket: "bantu-now.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000000000",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// ========== API Functions ==========

const API_BASE = "http://localhost:3000"

export async function createJob(prompt) {
    const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
    })

    if (!res.ok) throw new Error("Failed to generate job")

    return res.json()
}

// ========== Firestore Listeners ==========

/**
 * Subscribe to real-time job updates from Firestore.
 * Returns an unsubscribe function for cleanup.
 *
 * @param {function} callback - receives array of job objects
 * @returns {function} unsubscribe
 */
export function onJobsSnapshot(callback) {
    const jobsRef = collection(db, "jobs")
    const q = query(jobsRef, where("status", "==", "open"))

    return onSnapshot(
        q,
        (snapshot) => {
            const jobs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            callback(jobs)
        },
        (error) => {
            console.error("Firestore listener error:", error)
            callback([])
        }
    )
}
