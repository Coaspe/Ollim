import { Navigate } from "react-router-dom";

const IsUserLoggedIn = ({ children, user }) => {
  if (user !== null || user !== {}) {
    return <Navigate to={`/${user.uid}`} />;
  }
  return children;
};

export default IsUserLoggedIn;
