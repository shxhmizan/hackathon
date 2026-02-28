# 🛠️ BantuNow  

<p align="center">
  <img src="https://img.shields.io/badge/Team-DevBugginG-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/SDG-1%20No%20Poverty-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge&logo=firebase" />
  <img src="https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google" />
</p>

### 🚀 Hyperlocal AI-Assisted Task Marketplace  
### 👥 Team DevBugginG  
### 🌍 SDG 1 – No Poverty  

BantuNow is a hyperlocal, AI-assisted task-matching platform designed to connect people who need help with everyday tasks to nearby individuals willing to earn by helping.

Our mission is to empower communities and create accessible micro-income opportunities through technology.

---

## 🌐 Live Demo

👉 **https://bantu-now.vercel.app/**

---

# 📌 Problem Statement

In many communities:

- Busy families lack time to complete daily tasks.
- Elderly individuals need assistance but lack easy access to help.
- Students and low-income individuals seek flexible income opportunities.
- Informal job opportunities remain fragmented and disconnected.

There is no centralized, localized, real-time system that connects these needs efficiently.

**BantuNow bridges this gap.**

---

# 💡 Solution Overview

BantuNow provides:

- 🗺️ Real-time interactive job map  
- 🔥 Heatmap visualization of job density  
- 🤝 Task acceptance & tracking  
- 💬 Real-time chat between users  
- 🤖 AI assistant (BantuBot powered by Gemini)  
- 📊 Full job lifecycle management  

We transform everyday community needs into structured economic opportunities.

---

# 🏗️ Technical Architecture
---

## 🔹 Frontend
- React (Vite)
- TailwindCSS
- React-Leaflet
- leaflet.heat
- Firebase SDK

## 🔹 Backend
- Node.js
- Express.js
- Gemini API integration
- Hosted on Render

## 🔹 Google Technologies Used
- Firebase Authentication
- Firestore (real-time NoSQL database)
- Firebase Storage
- Gemini API (Natural Language Processing)

---

# ⚙️ Implementation Details

## 🔐 Authentication
- Secure login & signup via Firebase Authentication.
- Token-based session handling.

## 🗺️ Real-Time Job System
- Jobs stored in Firestore collection.
- Real-time listeners update:
  - Map markers
  - Job status
  - “Kerja Saya” dashboard

## 🔥 Map & Heatmap
- React-Leaflet renders job markers.
- Heatmap visualizes job density.
- Color-coded job states:
  - Open
  - In Progress
  - Completed

## 🔄 Job Lifecycle
1. User posts task  
2. Task appears on map  
3. Another user accepts task  
4. Status changes to “In Progress”  
5. Job marked as completed  

## 💬 Chat System
- Real-time Firestore chat collection
- Scoped per job
- Instant UI updates

## 🤖 AI Assistant (BantuBot)
- User message sent to backend
- Backend calls Gemini API
- Gemini processes:
  - Income target intent
  - Task creation assistance
  - Smart suggestions
- AI response returned to frontend

---

# 🚀 Live Demo Features

- 300+ distributed dummy jobs across Malaysia
- Heatmap toggle
- Task detail view
- Accept & complete workflow
- Real-time chat
- AI-powered assistance

---

# 🧩 Challenges Faced

### 1️⃣ Real-Time Sync Complexity
Ensuring consistent job state updates across multiple users required efficient Firestore listener management.

### 2️⃣ AI Prompt Engineering
Fine-tuning Gemini prompts to accurately interpret:
- Income goals
- Task descriptions
- User intent

### 3️⃣ Heatmap Performance
Rendering high-volume markers while maintaining UI performance required optimized data filtering.

### 4️⃣ Deployment Configuration
Managing environment variables across local and production environments for:
- Firebase config
- Gemini API key
- Backend endpoints

---

# 🔮 Future Roadmap

## 🔹 Phase 1 – Platform Maturity
- Rating & review system
- Secure in-app payment integration
- Job category filtering
- Push notifications

## 🔹 Phase 2 – Smart Optimization
- AI-based job pricing recommendations
- Intelligent job matching algorithm
- Income goal tracking dashboard

## 🔹 Phase 3 – Scalability
- Multi-country deployment
- Progressive Web App (PWA)
- Android & iOS mobile app
- Admin analytics dashboard

---

# 📊 Impact Potential

BantuNow contributes to SDG 1 by:

- Creating accessible micro-income opportunities
- Supporting informal workers
- Strengthening community collaboration
- Reducing friction in hyperlocal job matching

Even small local tasks can generate meaningful economic impact when scaled.

---

# 🛠️ Project Setup Guide

## 🔹 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Firebase project
- Gemini API key

---

## 🔹 1️⃣ Clone Repository

```bash
git clone https://github.com/shxhmizan/hackathon.git
cd hackathon
```
## 🔹 2️⃣ Setup Frontend
```bash
cd client
npm install
```

Create a .env file inside /client:

-VITE_FIREBASE_API_KEY=your_key
-VITE_FIREBASE_AUTH_DOMAIN=your_domain
-VITE_FIREBASE_PROJECT_ID=your_project_id
-VITE_FIREBASE_STORAGE_BUCKET=your_bucket
-VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
-VITE_FIREBASE_APP_ID=your_app_id
-VITE_BACKEND_URL=http://localhost:5000

Run frontend:

```bash
npm run dev
```

##🔹 3️⃣ Setup Backend
cd server
npm install

Create a .env file inside /server:

GEMINI_API_KEY=your_gemini_key
PORT=5000

Run backend:

node index.js

##🔹 4️⃣ Firebase Configuration

Create Firebase project

Enable:

Authentication (Email/Password)

Firestore

Storage

Add Web App

Copy configuration into frontend .env

Configure Firestore rules for development
