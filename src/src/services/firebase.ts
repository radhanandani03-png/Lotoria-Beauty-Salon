import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBll_a2VWCuwN0hg-28n5pmCXqSvqxpQ0U",
  authDomain: "lotoria-salon.firebaseapp.com",
  projectId: "lotoria-salon",
  storageBucket: "lotoria-salon.firebasestorage.app",
  messagingSenderId: "16085466934",
  appId: "1:16085466934:web:df71f7c3082c7e1007bd97",
  measurementId: "G-TH70842WB9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
