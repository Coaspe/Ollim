import { createContext } from "react";
import Firebase from "firebase/compat/app";
import Firestore from "firebase/firestore";
import { FirebaseStorage } from "@firebase/storage";

type FirebaseContextProps = {
  firebase: Firebase.app.App;
  FieldValue: Firestore.FieldValue | any;
  storage: FirebaseStorage | any;
}

const FirebaseContext = createContext<FirebaseContextProps>({} as FirebaseContextProps)

export default FirebaseContext;