import { Navigate } from "react-router-dom";
import LoadingIcon from "@/components/reusable_component/loading";
import type { JSX } from "react";
import { useAdminAuth } from "./useAuth";

const ProtectedAdminRoute = ({ element }: { element: JSX.Element }) => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) return <LoadingIcon />;
  if (!isAdmin) return <Navigate to="/admin/login" />;

  return element;
};

export { ProtectedAdminRoute };
