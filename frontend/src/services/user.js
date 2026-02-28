// Simple user identity — wraps Firebase Auth for components that need user info
// Falls back to localStorage for backward compatibility

import { auth } from "./firebase"

export function getCurrentUser() {
    const firebaseUser = auth.currentUser
    if (firebaseUser) {
        return {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.displayName || "User"}`,
        }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem("bantu_now_user")
    if (stored) return JSON.parse(stored)

    return { id: "anonymous", name: "Guest", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" }
}
