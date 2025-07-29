// AdminProtectedRoute.tsx
import { useAuth } from "@/context/authContext";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

const AdminProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
