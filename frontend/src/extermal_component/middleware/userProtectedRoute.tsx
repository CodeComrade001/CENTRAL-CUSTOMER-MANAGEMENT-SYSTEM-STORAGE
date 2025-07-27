import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

interface UserProtectedRouteProps {
  children: JSX.Element;
  isUserAuthenticated: boolean;
}

const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({ isUserAuthenticated, children }) => {
  // Replace this with actual logic when ready
  // const isAuthenticated = true;

  if (!isUserAuthenticated) {
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default UserProtectedRoute;
