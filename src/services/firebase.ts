import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- DHYAN DEIN: NICHE APNI ASLI KEYS PASTE KAREIN ---
// Agar aapne ye nahi kiya to App "Loading..." par atka rahega.

const firebaseConfig = {
  // Yahan apna Firebase Console wala code paste karein
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "lotoria-salon.firebaseapp.com",
  projectId: "lotoria-salon",
  storageBucket: "lotoria-salon.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);