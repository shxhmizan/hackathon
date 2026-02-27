import { useState } from "react"

import Home from "./pages/Home"
import PostScreen from "./components/PostScreen"
import ChatScreen from "./components/ChatScreen"
import ProfileScreen from "./components/ProfileScreen"
import BottomNav from "./components/BottomNav"

export default function App() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="min-h-screen w-full bg-bantu-gray">
      {/* Desktop: sidebar + content layout */}
      <div className="flex min-h-screen">
        {/* Sidebar nav (desktop only) */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main content area */}
        <main className="flex-1 pb-20 md:pb-0 min-h-screen">
          {activeTab === "home" && <Home />}
          {activeTab === "post" && <PostScreen />}
          {activeTab === "chat" && <ChatScreen />}
          {activeTab === "profile" && <ProfileScreen />}
        </main>
      </div>
    </div>
  )
}