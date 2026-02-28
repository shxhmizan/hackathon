import { db } from "./firebase"
import {
    collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
    onSnapshot, query, where, orderBy, serverTimestamp,
} from "firebase/firestore"
import { storage } from "./firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

const API_BASE = "http://localhost:3000"

// ========== Backend API ==========

export async function createJobAI(prompt) {
    const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
    })
    if (!res.ok) throw new Error("Failed to generate job")
    return res.json()
}

export async function sendBantuBot(message, userId, location) {
    const res = await fetch(`${API_BASE}/api/bantubot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId, location }),
    })
    if (!res.ok) throw new Error("BantuBot request failed")
    return res.json()
}

// ========== Image Upload ==========

export async function uploadImage(file) {
    const filename = `jobs/${Date.now()}_${file.name}`
    const storageRef = ref(storage, filename)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
}

// ========== Jobs ==========

export async function saveJob(jobData) {
    const docRef = await addDoc(collection(db, "jobs"), {
        ...jobData,
        status: "open",
        created_at: serverTimestamp(),
    })
    return docRef.id
}

export async function getJob(jobId) {
    const snap = await getDoc(doc(db, "jobs", jobId))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
}

export async function acceptJob(jobId, executorId) {
    await updateDoc(doc(db, "jobs", jobId), {
        status: "in_progress",
        executor_id: executorId,
    })
}

export async function completeJob(jobId) {
    await updateDoc(doc(db, "jobs", jobId), {
        status: "completed",
    })
}

export async function cancelJob(jobId, chatId) {
    await updateDoc(doc(db, "jobs", jobId), {
        status: "open",
        executor_id: null,
    })
    if (chatId) {
        await deleteDoc(doc(db, "chats", chatId))
    }
}

export function onAllJobsSnapshot(callback) {
    const q = query(collection(db, "jobs"), orderBy("created_at", "desc"))
    return onSnapshot(q,
        (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        (err) => { console.error("Jobs listener:", err); callback([]) }
    )
}

// ========== Chats ==========

export async function createChat(jobId, ownerId, executorId) {
    const docRef = await addDoc(collection(db, "chats"), {
        job_id: jobId,
        owner_id: ownerId,
        executor_id: executorId,
        last_message: "Tugasan diterima! 🤝",
        last_updated: serverTimestamp(),
    })
    return docRef.id
}

export function onChatsSnapshot(userId, callback) {
    // Firestore doesn't support OR queries on different fields easily,
    // so we fetch all chats and filter client-side (fine for prototype)
    return onSnapshot(collection(db, "chats"),
        (snap) => {
            const chats = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .filter((c) => c.owner_id === userId || c.executor_id === userId)
            callback(chats)
        },
        (err) => { console.error("Chats listener:", err); callback([]) }
    )
}

export function onMessagesSnapshot(chatId, callback) {
    const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "asc")
    )
    return onSnapshot(q,
        (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        (err) => { console.error("Messages listener:", err); callback([]) }
    )
}

export async function sendMessage(chatId, senderId, text) {
    await addDoc(collection(db, "chats", chatId, "messages"), {
        sender_id: senderId,
        text,
        timestamp: serverTimestamp(),
    })
    await updateDoc(doc(db, "chats", chatId), {
        last_message: text,
        last_updated: serverTimestamp(),
    })
}
