import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAE7vNT05Em7836nK5-8UWDBgWVE0QkgNM",
  authDomain: "alphaai-29a5a.firebaseapp.com",
  projectId: "alphaai-29a5a",
  storageBucket: "alphaai-29a5a.firebasestorage.app",
  messagingSenderId: "595892148998",
  appId: "1:595892148998:web:360c3295cc073544cc9c87"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();