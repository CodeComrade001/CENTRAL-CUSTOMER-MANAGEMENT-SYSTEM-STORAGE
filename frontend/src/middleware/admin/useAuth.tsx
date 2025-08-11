import { useContext } from "react";
import { AdminAuthContext } from "./adminAuthContext";

// Hook to use the auth context

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
