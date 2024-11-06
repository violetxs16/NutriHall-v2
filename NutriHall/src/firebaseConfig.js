// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDg1AXQ-uy1YSMH9cs8_KPutnls1efHEwQ",
    authDomain: "nutrihall-26949.firebaseapp.com",
    databaseURL: "https://nutrihall-26949-default-rtdb.firebaseio.com",
    projectId: "nutrihall-26949",
    storageBucket: "nutrihall-26949.appspot.com",
    messagingSenderId: "561607807866",
    appId: "1:561607807866:web:f0d779706806f698e6fcc3",
    measurementId: "G-V8C0DHE8Y3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { auth, database };
