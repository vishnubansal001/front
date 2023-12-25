// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-a03c8.firebaseapp.com",
  projectId: "real-estate-a03c8",
  storageBucket: "real-estate-a03c8.appspot.com",
  messagingSenderId: "651500483467",
  appId: "1:651500483467:web:a4c6fc33c1d49fe63f358e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);