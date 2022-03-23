import { Navigate } from "react-router-dom";

const IsUserLoggedIn = ({ children, user }) => {
  if (user !== null || user !== {}) {
    return children;
  }
  return <Navigate to={`/${user.uid}`} />;
};

export default IsUserLoggedIn;
