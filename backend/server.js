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

app.post("/api/generate", async (req, res) => {
    try {
        const { prompt } = req.body

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

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

        // Clean Gemini markdown formatting if exists
        const cleaned = text.replace(/```json|```/g, "").trim()

        const jobData = JSON.parse(cleaned)

        // 🔥 SAVE TO FIREBASE
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
        res.status(500).json({
            error: error.message,
            full: error
        })
    }
})

app.listen(3000, () => {
    console.log("Backend running on port 3000")
})