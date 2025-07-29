// src/components/routes/UserProtectedRoute.tsx
import { useAuth } from "@/context/authContext";
import { Navigate } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { APi__ValidateUser } from "@/services/api";

const UserProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, setIsAuthenticated, role, setRole, loading, setLoading } = useAuth();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await APi__ValidateUser();
        if (res.status === 200 && res.data.isAuthenticated) {
          setIsAuthenticated(true);
          setRole(res.data.role || null);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [setIsAuthenticated, setLoading, setRole]);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default UserProtectedRoute;
