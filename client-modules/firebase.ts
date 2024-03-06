import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, inMemoryPersistence, signInWithPopup, type User } from "firebase/auth"
import { getCookie } from "./util"

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "dollar-waitlist.firebaseapp.com",
    projectId: "dollar-waitlist",
    storageBucket: "dollar-waitlist.appspot.com",
    messagingSenderId: "366514623889",
    appId: "1:366514623889:web:dfeba19026cf16755cf630",
    measurementId: "G-VCHLQ18EMB"
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export const auth = getAuth(app)

auth.setPersistence(inMemoryPersistence)

window.signIn = async (lastLogin?: string) => {
    try {

        const provider = new GoogleAuthProvider()

        if (lastLogin)
            provider.setCustomParameters({ login_hint: lastLogin })

        const { user } = await signInWithPopup(auth, provider)
        const idToken = await user.getIdToken()
        const csrfToken = getCookie("csrfToken")

        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idToken, csrfToken })
        })

        if (!res.ok)
            throw new Error("Failed to sign in")

        window.location.assign("/projects")
    }
    catch (err) {
        console.error(err)
        window.location.reload()
    }
}

declare global {
    interface Window {
        signIn: (lastLogin?: string) => Promise<void>
        user: User | null
    }
}