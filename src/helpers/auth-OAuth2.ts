import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  getAuth,
} from "firebase/auth";
import {
  singInWithGoogleInfoToFB,
  doesEmailExist,
} from "../services/firebase";
import { NavigateFunction } from "react-router-dom";

export const signInWithGoogle = (navi: NavigateFunction) => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  return signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      console.log(typeof(result));
      doesEmailExist(result.user.email as string).then((r: any) => {
        if (!r) {
          console.log(r);
          singInWithGoogleInfoToFB(result).then(() => {
            navi("/");
          });
        } else {
          navi("/");
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
