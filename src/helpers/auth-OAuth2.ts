import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  getAuth,
} from "firebase/auth";
import { signInWithGoogleInfo, doesEmailExist } from "../services/firebase";
import { NavigateFunction } from "react-router-dom";

export const signInWithGoogle = (navi: NavigateFunction) => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  return signInWithPopup(auth, provider)
    .then((result) => {
      doesEmailExist(result.user.email as string).then((r: any) => {
        if (!r) {
          // if not exists sign in
          signInWithGoogleInfo(result).then(() => {
            navi(`/${result.user.uid}`);
          });
        } else {
          // if exists login
         navi(`/${result.user.uid}`)
        }
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const signOutAuth = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("Sign out");
       window.location.reload()
    })
    .catch((error) => {
      // An error happened.
      console.log(error.message);
    });
};
