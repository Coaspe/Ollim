import { useState, useEffect, useContext } from "react";
import FirebaseContext from "../context/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAuthListner = () => {
  const { firebase } = useContext(FirebaseContext);
  const [user, setUser] = useState<any>(
    JSON.parse(localStorage.getItem("authUser") as string)
  );

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (authUser) => {
      // we have a user... therefore we can store the user in localstorage
      if (authUser) {
        localStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
      } else {
        // we don't have an authUser, therefore clear the localstorage
        localStorage.removeItem("authUser");
        setUser({} as any);
      }
    });
  }, [firebase]);
  return { user } ;
};

export default useAuthListner;
