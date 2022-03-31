import { Navigate } from "react-router-dom";

const IsUserLoggedIn = ({ children, user }) => {
  if (user && user.uid) {
    console.log(user);
    return <Navigate to={`/${user.uid}`} />;
  }
  return children;
};

export default IsUserLoggedIn;
