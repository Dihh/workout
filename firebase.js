import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBzK47vofpj7goIWkY453qqCMJkUzrc4-8",
    authDomain: "workout-e.firebaseapp.com",
    projectId: "workout-e",
    storageBucket: "workout-e.firebasestorage.app",
    messagingSenderId: "946521146142",
    appId: "1:946521146142:web:615a98f7948dbb107bbf0f"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();

export function signInWithGoogle() {
    return signInWithPopup(auth, googleProvider);
}

export function signOutUser() {
    return signOut(auth);
}

export { onAuthStateChanged };
