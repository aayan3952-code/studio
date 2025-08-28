
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqJkpa_JlAroRiusk-K9IUDt1_Li00PPg",
  authDomain: "stepform-4b234.firebaseapp.com",
  projectId: "stepform-4b234",
  storageBucket: "stepform-4b234.appspot.com",
  messagingSenderId: "739624413935",
  appId: "1:739624413935:web:20dfc42f2ec534e026091a",
  measurementId: "G-HZPZTVEN7S"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);

export { app, firestore };
