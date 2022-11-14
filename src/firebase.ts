// Firebase boilerplate config
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
    apiKey: "AIzaSyDpIbOWVn_TWFhNz8SswkSm0b2qczg7qAM",
    authDomain: "xiozuma.firebaseapp.com",
    projectId: "xiozuma",
    storageBucket: "xiozuma.appspot.com",
    messagingSenderId: "370395880113",
    appId: "1:370395880113:web:ba6d4bb6119c64b4a92090",
});

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export default app;
