import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { NavigateFunction } from "react-router-dom";
import { signupWithEmail } from "../services/firebase";

export const verifyEmail = (email: string) => {
  const auth = getAuth();
  var actionCodeSettings = {
    url: "http://localhost:3000/",
    handleCodeInApp: true,
  };
  return sendSignInLinkToEmail(auth, email, actionCodeSettings);
};
export const createAccountWithEmailAndPassword = (
  email: string,
  password: string,
  username: string,
  navi: NavigateFunction
) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.localStorage.removeItem("verificatedEmail");
      signupWithEmail(user, username)
        .then(() => {
          navi(`/${user.uid}`);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);

      switch (error.code) {
        case "EMAIL_EXISTS":
          break;

        default:
          break;
      }
      if (error.code === "EMAIL_EXISTS") {
      }
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
