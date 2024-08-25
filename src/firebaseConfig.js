// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBz22-NfAKCTF8knGNqDiV2L79RbhlVx1I",
  authDomain: "expensecalculator-8123.firebaseapp.com",
  projectId: "expensecalculator-8123",
  storageBucket: "expensecalculator-8123.appspot.com",
  messagingSenderId: "1060999843305",
  appId: "1:1060999843305:web:f858c76e337b69c7340f78",
  measurementId: "G-8Q8K6DQYZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
