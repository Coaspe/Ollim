import { createContext } from "react";
import Firebase from "firebase/compat/app";

type userContextType = {
    user : Firebase.User
}
const UserContext = createContext<userContextType>({} as userContextType);

export default UserContext;
