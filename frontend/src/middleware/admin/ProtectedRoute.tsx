// ProtectedAdminRoute.tsx
import { Navigate } from "react-router-dom";
import LoadingIcon from "@/components/reusable_component/loading";
import { useAdminAuth } from "./useAuth";
import type { JSX } from "react";

const ProtectedAdminRoute = ({ element }: { element: JSX.Element }) => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading || isAdmin === null) return <LoadingIcon />;
  if (!isAdmin) return <Navigate to="/admin/signin" replace />;

  return element;
};

export default ProtectedAdminRoute;
