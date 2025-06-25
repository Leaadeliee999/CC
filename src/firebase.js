// src/firebase.jsAdd commentMore actions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCc1Fm1ysI7EJYLfSj4MMpiV3JUyrjaGso",
  authDomain: "canvas-conquest.firebaseapp.com",
  projectId: "canvas-conquest",
  storageBucket: "canvas-conquest.appspot.com", // ✅ FIXED
  messagingSenderId: "541310596762",
  appId: "1:541310596762:web:8d8917f1566a0029ff9123",
  measurementId: "G-8XN3XZ2J3N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);