import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, FieldValue } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD4m-vmjusGiwAC4F3JRekSDTW2a9ITn9c",
  authDomain: "ollim-df732.firebaseapp.com",
  databaseURL: "https://ollim-df732-default-rtdb.firebaseio.com",
  projectId: "ollim-df732",
  storageBucket: "ollim-df732.appspot.com",
  messagingSenderId: "292055520391",
  appId: "1:292055520391:web:764d606fe180eff5ea1422",
  measurementId: "G-KM199ZSY1E",
};

// Initialize Firebase
const Firebase = initializeApp(firebaseConfig);
const firebase = Firebase.firebase;
const firestore = getFirestore(Firebase);
const storageRef = getStorage(Firebase);
const rtDBRef = getDatabase(Firebase);

export { firebase, firestore, FieldValue, storageRef, rtDBRef };
