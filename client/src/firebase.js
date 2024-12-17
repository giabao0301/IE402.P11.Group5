// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ie402-group5.firebaseapp.com",
  projectId: "ie402-group5",
  storageBucket: "ie402-group5.firebasestorage.app",
  messagingSenderId: "1017877643477",
  appId: "1:1017877643477:web:c20afb1303fcb57bd5225c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
