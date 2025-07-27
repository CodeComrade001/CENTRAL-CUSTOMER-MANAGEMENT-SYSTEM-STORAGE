import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

interface AdminProtectedRouteProps {
  children: JSX.Element;
  isAdminAuthenticated: boolean;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ isAdminAuthenticated, children }) => {
  // Replace this with actual logic when ready
  // const isAdminAuthenticated = true;

  if (!isAdminAuthenticated) {
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
