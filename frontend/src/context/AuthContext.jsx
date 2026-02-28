import { createContext, useContext, useState, useEffect } from "react"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../services/firebase"

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    async function register(email, password, name) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(cred.user, { displayName: name })
        // Create Firestore user doc
        await setDoc(doc(db, "users", cred.user.uid), {
            id: cred.user.uid,
            name,
            email,
            created_at: serverTimestamp(),
            role: "user",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        })
        return cred.user
    }

    async function login(email, password) {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        return cred.user
    }

    async function logout() {
        await signOut(auth)
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsub
    }, [])

    const value = { currentUser, loading, register, login, logout }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
