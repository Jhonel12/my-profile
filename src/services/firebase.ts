// Import the Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBCvBUNW5nOQAz2KpiOa8clhuOjt3LCEgg",
  authDomain: "my-profile-4375d.firebaseapp.com",
  projectId: "my-profile-4375d",
  storageBucket: "my-profile-4375d.firebasestorage.app",
  messagingSenderId: "790769174941",
  appId: "1:790769174941:web:45b399cc77006442c1c774",
  measurementId: "G-9JEYDXZVKH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
