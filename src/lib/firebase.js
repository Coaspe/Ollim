import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, FieldValue } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
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
const storage = getStorage(Firebase, "gs://ollim-df732.appspot.com");
const rtDBRef = getDatabase(Firebase);

export { Firebase, firebase, firestore, FieldValue, storage, rtDBRef };
