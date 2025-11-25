import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- IMPORTANT: PASTE YOUR FIREBASE KEYS BELOW ---
// Replace the values below with the code you copied from Firebase Console

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "lotoria-salon.firebaseapp.com",
  projectId: "lotoria-salon",
  storageBucket: "lotoria-salon.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);