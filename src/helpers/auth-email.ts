import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { NavigateFunction } from "react-router-dom";
import { signInWithEmail } from "../services/firebase";

export const createAccountWithEmailAndPassword = (
  email: string,
  password: string,
  navi: NavigateFunction
) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      signInWithEmail(user).then(() => {
        navi(`/${user.uid}`);
      });
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const loginWithEmailAndPassword = (email: string, password: string) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);

      // ...
    })
    .catch((error) => {
      console.log(error);
    });
};
