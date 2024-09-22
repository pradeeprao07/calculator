import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBz22-NfAKCTF8knGNqDiV2L79RbhlVx1I",
  authDomain: "expensecalculator-8123.firebaseapp.com",
  projectId: "expensecalculator-8123",
  storageBucket: "expensecalculator-8123.appspot.com",
  messagingSenderId: "1060999843305",
  appId: "1:1060999843305:web:f858c76e337b69c7340f78",
  measurementId: "G-8Q8K6DQYZE"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { database };
