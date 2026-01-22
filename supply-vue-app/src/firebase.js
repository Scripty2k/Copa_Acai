// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5cL60HUyshws7NzGuue8ZgUd_y5pdmNI",
  authDomain: "copa-acai.firebaseapp.com",
  projectId: "copa-acai",
  storageBucket: "copa-acai.firebasestorage.app",
  messagingSenderId: "270973239105",
  appId: "1:270973239105:web:6185d7aa03064e0a212bc0"
};

const appFirebase = initializeApp(firebaseConfig); //initialize firebase app using config above here
export const auth = getAuth(appFirebase);
export const db = getFirestore(appFirebase);
export const storage = getStorage(appFirebase);
export default appFirebase;
