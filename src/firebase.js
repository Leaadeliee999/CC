import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ⬅️ untuk upload gambar ke Storage

const firebaseConfig = {
  apiKey: "AIzaSyCc1Fm1ysI7EJYLfSj4MMpiV3JUyrjaGso",
  authDomain: "canvas-conquest.firebaseapp.com",
  projectId: "canvas-conquest",
  storageBucket: "canvas-conquest.appspot.com",
  messagingSenderId: "541310596762",
  appId: "1:541310596762:web:8d8917f1566a0029ff9123",
  measurementId: "G-8XN3XZ2J3N"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor modul yang dibutuhkan
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ⬅️ ini penting untuk upload gambar
