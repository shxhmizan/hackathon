import { useState, useCallback } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"

import Home from "./pages/Home"
import BagiKerja from "./pages/BagiKerja"
import BantuBot from "./pages/BantuBot"
import KerjaSaya from "./pages/KerjaSaya"
import KerjaSayaDetail from "./pages/KerjaSayaDetail"
import RecceTugasan from "./pages/RecceTugasan"
import ProfileScreen from "./components/ProfileScreen"
import BottomNav from "./components/BottomNav"
import Splash from "./pages/Splash"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

function AppContent() {
  const { currentUser, loading } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const [authPage, setAuthPage] = useState("login")
  const [activeTab, setActiveTab] = useState("home")
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [showHeatmap, setShowHeatmap] = useState(false)

  const handleSplashFinish = useCallback(() => setShowSplash(false), [])

  if (showSplash) return <Splash onFinish={handleSplashFinish} />

  if (loading) {
    return (
      <div className="min-h-screen bg-bantu-dark flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-700 border-t-bantu-orange rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!currentUser) {
    if (authPage === "signup") {
      return <Signup onSwitch={() => setAuthPage("login")} onSuccess={() => { }} />
    }
    return <Login onSwitch={() => setAuthPage("signup")} onSuccess={() => { }} />
  }

  function handleJobSelect(jobId) {
    setSelectedJobId(jobId)
    setActiveTab("recce")
  }

  function handleBackToMap() {
    setSelectedJobId(null)
    setActiveTab("home")
  }

  function handleKerjaSayaDetail(jobId) {
    setSelectedJobId(jobId)
    setActiveTab("kerja-detail")
  }

  function handleBackToKerjaSaya() {
    setSelectedJobId(null)
    setActiveTab("kerjasaya")
  }

  return (
    <div className="min-h-screen w-full bg-bantu-gray">
      <div className="flex min-h-screen">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 pb-20 md:pb-0 min-h-screen">
          {activeTab === "home" && (
            <Home onJobSelect={handleJobSelect} showHeatmap={showHeatmap} setShowHeatmap={setShowHeatmap} />
          )}
          {activeTab === "bagikerja" && <BagiKerja onJobCreated={() => setActiveTab("home")} />}
          {activeTab === "bantubot" && <BantuBot />}
          {activeTab === "kerjasaya" && <KerjaSaya onOpenDetail={handleKerjaSayaDetail} />}
          {activeTab === "kerja-detail" && (
            <KerjaSayaDetail
              jobId={selectedJobId}
              onBack={handleBackToKerjaSaya}
              onGoToMap={handleBackToMap}
              onGoToKerjaSaya={handleBackToKerjaSaya}
            />
          )}
          {activeTab === "recce" && (
            <RecceTugasan
              jobId={selectedJobId}
              onBack={handleBackToMap}
              onChatOpen={() => { setActiveTab("kerjasaya") }}
            />
          )}
          {activeTab === "profile" && <ProfileScreen />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}