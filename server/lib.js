import Firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

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
export const firebase = Firebase.initializeApp(firebaseConfig);
export const { FieldValue } = firebase.firestore;
export const storageRef = Firebase.storage().ref();
