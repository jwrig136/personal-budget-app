// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMF3ivIKiMpaL07FPmrYxj_wsBX5E4caU",
  authDomain: "personalbudget-369c4.firebaseapp.com",
  projectId: "personalbudget-369c4",
  storageBucket: "personalbudget-369c4.appspot.com",
  messagingSenderId: "980272867295",
  appId: "1:980272867295:web:71e929aa791c720992466a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;