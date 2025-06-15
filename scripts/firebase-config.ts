// scripts/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmOlF2lAd7iO6bVlGE0hxdt2Brl6EHpX0",
  authDomain: "ecommerce-5c209.firebaseapp.com",
  projectId: "ecommerce-5c209",
  storageBucket: "ecommerce-5c209.firebasestorage.app",
  messagingSenderId: "952160288471",
  appId: "1:952160288471:web:9d63dd378ba8de3de47a92",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
