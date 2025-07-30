import { useContext } from "react";
import { Navigate } from "react-router-dom";
import adminAuthContext from "./adminAuthContext";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(adminAuthContext);

  if (!context) {
    throw new Error("ProtectedAdminRoute must be used within an AdminAuthProvider");
  }

  const { isAuthenticated } = context;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
