import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyChwNcWtWjxkWZNZeGv8Ou-SxcxRBomCqU",
    authDomain: "bantu-now.firebaseapp.com",
    projectId: "bantu-now",
    storageBucket: "bantu-now.firebasestorage.app",
    messagingSenderId: "290727404013",
    appId: "1:290727404013:web:b30c41b0ce3296c17087e4",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
export default app
