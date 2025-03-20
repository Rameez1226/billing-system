// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDx5-3ukCeOQfF4Btnk16Ikn9iaEZ7MyP8",
  authDomain: "chat-module-mock.firebaseapp.com",
  projectId: "chat-module-mock",
  storageBucket: "chat-module-mock.firebasestorage.app",
  messagingSenderId: "933643562359",
  appId: "1:933643562359:web:62a8933e4e1a61435ec572",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs };
