import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
    apiKey: "AIzaSyCZCMciPsZemPU3-uKnOtk5f_7XckIM9Wg",
    authDomain: "xio-zuma.firebaseapp.com",
    projectId: "xio-zuma",
    storageBucket: "xio-zuma.appspot.com",
    messagingSenderId: "676316923538",
    appId: "1:676316923538:web:2a12ffbfe4b2213ea7084b",
});

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export default app;
