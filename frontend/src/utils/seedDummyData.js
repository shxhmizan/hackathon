import { db } from "../services/firebase"
import { collection, addDoc, getDocs, Timestamp, writeBatch, doc } from "firebase/firestore"

// ========== DUMMY USERS ==========
const DUMMY_USERS = [
    { id: "user_amir", name: "Amir Izzat", email: "amir@demo.com", rating: 4.8 },
    { id: "user_siti", name: "Siti Aisyah", email: "siti@demo.com", rating: 4.5 },
    { id: "user_daniel", name: "Daniel Lee", email: "daniel@demo.com", rating: 4.2 },
    { id: "user_aina", name: "Aina Sofea", email: "aina@demo.com", rating: 4.9 },
    { id: "user_faiz", name: "Faiz Rahman", email: "faiz@demo.com", rating: 3.8 },
    { id: "user_kumar", name: "Kumar Raj", email: "kumar@demo.com", rating: 4.6 },
    { id: "user_jason", name: "Jason Tan", email: "jason@demo.com", rating: 4.3 },
    { id: "user_nurul", name: "Nurul Huda", email: "nurul@demo.com", rating: 4.7 },
]

// ========== JOB TEMPLATES ==========
const JOB_TEMPLATES = [
    { job_type: "Angkat Barang", titles: ["Angkat Sofa Tingkat 3", "Pindah Barang Stor", "Tolong Angkat Peti Ais"], descriptions: ["Perlukan bantuan angkat sofa dari tingkat 3 ke bawah. Ada lift kecil.", "Tolong pindahkan barang-barang stor ke rumah baru. Ada 5-6 kotak.", "Peti ais baru sampai, tolong angkat dari lori ke dapur."] },
    { job_type: "Potong Rumput", titles: ["Potong Rumput Halaman", "Kemas Taman Depan", "Potong Rumput + Buang Sampah"], descriptions: ["Rumput dah tinggi sangat, tolong potong sebelum raya.", "Taman depan rumah perlu kemas, rumput dan pokok dah liar.", "Potong rumput sekeliling rumah dan tolong buang sampah sarap."] },
    { job_type: "Cuci Rumah", titles: ["Cuci Rumah Sebelum Raya", "Deep Clean Dapur", "Cuci Bilik Air & Dapur"], descriptions: ["Rumah perlu deep clean sebelum family datang raya.", "Dapur dah lama tak cuci, perlu scrub lantai dan kabinet.", "Dua bilik air dan dapur perlu cuci bersih. Saya bagi RM50."] },
    { job_type: "Hantar Barang", titles: ["Hantar Parcel ke PosLaju", "Pickup Barang dari Lazada", "Hantar Dokumen ke Pejabat"], descriptions: ["Ada 3 kotak parcel perlu hantar ke PosLaju Subang.", "Tolong pickup barang Lazada dekat locker Giant Shah Alam.", "Perlu hantar dokumen penting ke pejabat Cyberjaya sebelum 5pm."] },
    { job_type: "Baiki Paip", titles: ["Paip Dapur Bocor", "Baiki Sinki Tersumbat", "Tukar Paip Bilik Air"], descriptions: ["Paip bawah sinki dapur bocor sikit, perlu tukang paip.", "Sinki bilik air tersumbat, air tak turun langsung.", "Paip air panas bilik air rosak, perlu tukar yang baru."] },
    { job_type: "Wiring Elektrik", titles: ["Pasang Kipas Siling", "Tukar Suis Rosak", "Wiring Lampu Taman"], descriptions: ["Nak pasang kipas siling baru, ceiling dah siap drilling.", "3 suis lampu rosak, perlu electrician datang tukar.", "Nak tambah lampu taman belakang rumah, perlu wiring baru."] },
    { job_type: "Cleaning Office", titles: ["Cuci Pejabat Kecil", "Vacuum & Mop Office", "Kemas Stor Pejabat"], descriptions: ["Pejabat kecil 500sqft perlu cuci sebelum audit.", "Perlu vacuum carpet dan mop tile area office setiap minggu.", "Stor pejabat sudah penuh, perlu tolong kemas dan susun."] },
    { job_type: "Event Setup", titles: ["Setup Kerusi Majlis", "Pasang Khemah Kenduri", "Deco Birthday Party"], descriptions: ["Tolong setup 100 kerusi untuk majlis di dewan komuniti.", "Perlu bantuan pasang 2 khemah untuk kenduri kawin hari Sabtu.", "Setup deco birthday party untuk anak, tema Frozen."] },
]

// Realistic KL/Selangor locations
const LOCATIONS = [
    { lat: 3.1390, lng: 101.6869 }, // KL City
    { lat: 3.1070, lng: 101.6340 }, // Petaling Jaya
    { lat: 3.0738, lng: 101.5183 }, // Shah Alam
    { lat: 3.0319, lng: 101.7688 }, // Cheras
    { lat: 3.1577, lng: 101.7119 }, // Ampang
    { lat: 3.0627, lng: 101.6704 }, // Bangsar
    { lat: 3.0833, lng: 101.5945 }, // Subang Jaya
    { lat: 3.1199, lng: 101.6525 }, // Damansara
    { lat: 3.1866, lng: 101.6959 }, // Setapak
    { lat: 3.0010, lng: 101.5420 }, // Klang
    { lat: 2.9468, lng: 101.7900 }, // Kajang
    { lat: 3.2300, lng: 101.7400 }, // Gombak
    { lat: 3.1100, lng: 101.7500 }, // Taman Permata
    { lat: 3.0500, lng: 101.7000 }, // Sri Petaling
    { lat: 3.1600, lng: 101.6100 }, // Kota Damansara
]

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randNum(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function jitter(val) { return val + (Math.random() - 0.5) * 0.02 }
function randomPastDate(daysBack) {
    const d = new Date()
    d.setDate(d.getDate() - randNum(0, daysBack))
    d.setHours(randNum(8, 20), randNum(0, 59))
    return Timestamp.fromDate(d)
}

// ========== CHAT MESSAGES ==========
const CHAT_SCRIPTS = [
    [
        { sender: "owner", text: "Hi, boleh datang pukul 3 petang?" },
        { sender: "executor", text: "Boleh, saya on the way 🚗" },
        { sender: "owner", text: "Parking dekat belakang rumah ya." },
        { sender: "executor", text: "Okay boss 👍" },
        { sender: "owner", text: "Dah sampai ke?" },
        { sender: "executor", text: "Dah depan gate, bukak please" },
    ],
    [
        { sender: "executor", text: "Assalamualaikum, saya dah terima tugas ni" },
        { sender: "owner", text: "Waalaikumsalam! Great, bila boleh datang?" },
        { sender: "executor", text: "Petang ni lepas Zohor boleh?" },
        { sender: "owner", text: "Boleh boleh, saya standby di rumah" },
        { sender: "executor", text: "On the way sekarang 🏃" },
    ],
    [
        { sender: "owner", text: "Bro, urgent ni. Boleh datang sekarang tak?" },
        { sender: "executor", text: "Weh kejap, 15 minit lagi sampai" },
        { sender: "owner", text: "Okay cepat ya, air dah merata lantai 😭" },
        { sender: "executor", text: "Relax bro, saya bawak tools semua" },
        { sender: "owner", text: "Tq bro, lifesaver!" },
        { sender: "executor", text: "No problem, itulah gunanya BantuNow 💪" },
    ],
    [
        { sender: "owner", text: "Sis, barang dekat guard house dah" },
        { sender: "executor", text: "Okay noted, saya pickup dalam 10 minit" },
        { sender: "owner", text: "Tq sis! Hantar ke alamat yang saya bagi ya" },
        { sender: "executor", text: "Insya-Allah, saya update bila dah sampai" },
    ],
    [
        { sender: "executor", text: "Salam, kerja ni still available?" },
        { sender: "owner", text: "Yes! Boleh start esok?" },
        { sender: "executor", text: "Esok pagi okay, lepas subuh terus datang" },
        { sender: "owner", text: "Perfect! Saya prepare semua tools" },
        { sender: "executor", text: "Alright, see you tomorrow 🔧" },
    ],
]

// ========== MAIN SEED FUNCTION ==========
export async function seedDummyData() {
    // Check if jobs already exist
    const existing = await getDocs(collection(db, "jobs"))
    if (existing.size > 5) {
        return { message: "Data sudah ada! (" + existing.size + " jobs)", skipped: true }
    }

    const batch = writeBatch(db)
    let jobCount = 0
    let chatCount = 0

    // Seed users
    for (const user of DUMMY_USERS) {
        const userRef = doc(db, "users", user.id)
        batch.set(userRef, {
            ...user,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
            created_at: randomPastDate(30),
            role: "user",
        })
    }

    await batch.commit()

    // Seed jobs (can't batch >500 with subcollections, so use addDoc)
    const statusPool = ["open", "open", "open", "open", "in_progress", "in_progress", "in_progress", "completed", "completed", "completed"]
    const createdJobs = []

    for (let i = 0; i < 25; i++) {
        const template = rand(JOB_TEMPLATES)
        const owner = rand(DUMMY_USERS)
        const status = rand(statusPool)
        const loc = rand(LOCATIONS)

        let executor = null
        if (status !== "open") {
            executor = rand(DUMMY_USERS.filter((u) => u.id !== owner.id))
        }

        const jobData = {
            job_type: template.job_type,
            title: rand(template.titles),
            description: rand(template.descriptions),
            gaji: randNum(20, 150),
            contact_no: `01${randNum(1, 9)}-${randNum(100, 999)} ${randNum(1000, 9999)}`,
            location: { lat: jitter(loc.lat), lng: jitter(loc.lng) },
            status,
            owner_id: owner.id,
            owner_name: owner.name,
            executor_id: executor ? executor.id : null,
            image_url: "",
            created_at: randomPastDate(14),
        }

        const jobRef = await addDoc(collection(db, "jobs"), jobData)
        createdJobs.push({ id: jobRef.id, ...jobData, executor })
        jobCount++
    }

    // Seed chats for in_progress + completed jobs
    const chatJobs = createdJobs.filter((j) => j.status !== "open" && j.executor)

    for (const job of chatJobs) {
        const script = rand(CHAT_SCRIPTS)
        const chatRef = await addDoc(collection(db, "chats"), {
            job_id: job.id,
            owner_id: job.owner_id,
            executor_id: job.executor_id,
            last_message: script[script.length - 1].text,
            last_updated: randomPastDate(3),
        })

        // Add messages with spaced timestamps
        const baseTime = new Date()
        baseTime.setHours(baseTime.getHours() - randNum(1, 48))

        for (let m = 0; m < script.length; m++) {
            const msgTime = new Date(baseTime.getTime() + m * randNum(60000, 600000))
            await addDoc(collection(db, "chats", chatRef.id, "messages"), {
                sender_id: script[m].sender === "owner" ? job.owner_id : job.executor_id,
                text: script[m].text,
                timestamp: Timestamp.fromDate(msgTime),
            })
        }
        chatCount++
    }

    return {
        message: `✅ Seeded ${jobCount} jobs, ${DUMMY_USERS.length} users, ${chatCount} chats!`,
        skipped: false,
    }
}
