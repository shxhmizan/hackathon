import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { db } from "./firebase.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// ========== Original: Generate Job ==========
app.post("/api/generate", async (req, res) => {
    try {
        const { prompt } = req.body

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

        const result = await model.generateContent(`
Extract job information from this sentence.

Return ONLY JSON in this format:
{
  "job_type": "",
  "budget": number,
  "time": "",
  "description": ""
}

Sentence:
"${prompt}"
`)

        const response = await result.response
        const text = response.text()
        const cleaned = text.replace(/```json|```/g, "").trim()
        const jobData = JSON.parse(cleaned)

        const docRef = await db.collection("jobs").add({
            ...jobData,
            status: "open",
            createdAt: new Date()
        })

        res.json({
            success: true,
            jobId: docRef.id,
            job: jobData
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

// ========== BantuBot AI ==========
app.post("/api/bantubot", async (req, res) => {
    try {
        const { message, userId, location } = req.body

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

        // Step 1: Classify intent
        const classifyResult = await model.generateContent(`
You are BantuBot, an AI assistant for BantuNow — a community task marketplace.

Classify the user's intent into one of:
- "earn_money" — user wants to find work/earn money/cari kerja
- "post_job" — user wants to create a task/post job/bagi kerja
- "general_question" — user asks about the app/general question

Also generate a helpful reply in Malay (Bahasa Malaysia) mixed with casual tone.

If intent is "post_job", extract these fields from the message:
- job_type (string)
- title (string)  
- description (string)
- gaji (number, in RM)

Return ONLY JSON:
{
  "intent": "earn_money" | "post_job" | "general_question",
  "reply": "your helpful reply",
  "job": { "job_type": "", "title": "", "description": "", "gaji": 0 } // only if post_job
}

User message: "${message}"
`)

        const classifyText = (await classifyResult.response).text()
        const cleaned = classifyText.replace(/```json|```/g, "").trim()
        const parsed = JSON.parse(cleaned)

        // Step 2: Handle by intent
        if (parsed.intent === "earn_money") {
            // Fetch open jobs from Firestore
            const jobsSnap = await db.collection("jobs")
                .where("status", "==", "open")
                .limit(5)
                .get()

            const jobs = jobsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            res.json({
                intent: "earn_money",
                reply: parsed.reply,
                jobs,
            })

        } else if (parsed.intent === "post_job" && parsed.job) {
            // Save job to Firestore
            const jobData = {
                ...parsed.job,
                gaji: parsed.job.gaji || 0,
                status: "open",
                owner_id: userId || "unknown",
                location: location || { lat: 3.1415, lng: 101.6932 },
                image_url: "",
                contact_no: "",
                executor_id: null,
                created_at: new Date(),
            }

            const docRef = await db.collection("jobs").add(jobData)

            res.json({
                intent: "post_job",
                reply: parsed.reply,
                job: { id: docRef.id, ...jobData },
                saved: true,
            })

        } else {
            res.json({
                intent: "general_question",
                reply: parsed.reply || "Saya BantuBot! Saya boleh bantu cari kerja atau buat tugasan.",
            })
        }

    } catch (error) {
        console.error("BantuBot error:", error)
        res.status(500).json({ error: error.message })
    }
})

app.listen(3000, () => {
    console.log("Backend running on port 3000")
})