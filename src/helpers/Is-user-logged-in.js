import { Navigate } from "react-router-dom";

const IsUserLoggedIn = ({ children, user }) => {
  if (user && user.uid) {
    return <Navigate to={`/${user.uid}`} />;
  }
  return children;
};

export default IsUserLoggedIn;
