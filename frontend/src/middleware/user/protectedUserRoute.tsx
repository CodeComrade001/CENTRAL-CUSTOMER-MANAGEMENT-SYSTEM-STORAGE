import { useContext } from "react";
import { Navigate } from "react-router-dom";
import userAuthContext from "./userAuthContext";

const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(userAuthContext);

  if (!context) {
    throw new Error("ProtectedAdminRoute must be used within an UserAuthProvider");
  }

  const { isAuthenticated } = context;

  if (!isAuthenticated) {
    return <Navigate to="/user/login" />;
  }

  return <>{children}</>;
};

export default ProtectedUserRoute;
