// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.FIREBASE_API_KEY,
  // authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  // projectId: import.meta.env.FIREBASE_PROJECT_ID,
  // storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.FIREBASE_APP_ID

  apiKey: "AIzaSyCKPShEHVCxyGcDE1o9LxyLy70kBgCx3Ig",
  authDomain: "real-estate-web-app-c1e82.firebaseapp.com",
  projectId: "real-estate-web-app-c1e82",
  storageBucket: "real-estate-web-app-c1e82.firebasestorage.app",
  messagingSenderId: "1007927734465",
  appId: "1:1007927734465:web:715a9836b70aacb803e440",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
