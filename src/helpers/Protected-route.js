import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children, user }) => {
  if (user !== null && user !== {}) {
    return children;
  }
  return <Navigate to="/intro" />;
};

export default ProtectedRoute;
