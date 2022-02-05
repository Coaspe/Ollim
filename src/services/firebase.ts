import { firebase, firestore, rtDBRef } from "../lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  startAfter,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  arrayRemove,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";

export const singInWithGoogleInfoToFB = (info: any) => {
  return setDoc(doc(firestore, "users", info.user.email), {
    userEmail: info.user.email.toLowerCase(),
    uid: info.user.uid,
    username: info.user.displayName.toLowerCase(),
    following: [],
    followers: [],
    postDocId: [],
    dateCreated: Date.now(),
    profileImg: info.user.photoURL,
    profileCaption: "",
  });
}

export async function doesEmailExist(userEmail: string) {
  const q = doc(firestore, "users", userEmail);
  const result = await getDoc(q);
  return result.exists();
}

export const getUserByEmail = async (email: string) => {
  return getDoc(doc(firestore, "users", email))
}