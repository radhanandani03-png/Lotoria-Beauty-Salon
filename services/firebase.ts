import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- IMPORTANT: PASTE YOUR FIREBASE KEYS HERE ---
// 1. Go to Firebase Console -> Project Settings -> General
// 2. Scroll down to "Your apps" -> "SDK setup and configuration" -> "Config"
// 3. Copy the values and replace the placeholders below.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);