import { useState, useEffect, useCallback, type ReactNode } from "react";
import { api__admin_validateAdmin } from "@/services/api";
import type { AxiosRequestConfig } from "axios";
import { AdminAuthContext } from "./adminAuthContext";
import { useNavigate } from "react-router-dom";

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkAdmin = useCallback(async (config?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api__admin_validateAdmin(config);

      if (res.status === 200) {
        setIsAdmin(true);
        return true
      } else {
        navigate("admin/login")
        setIsAdmin(false);
        return false
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setIsAdmin(false);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized access");
        navigate("admin/login")
        return false
      } else {
        navigate("admin/login")
        setError("Server error occurred");
        return false
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Function any component can call to force refresh
  const refreshValidation = useCallback((config?: AxiosRequestConfig) => {
    return checkAdmin(config); // This returns Promise<boolean>
  }, [checkAdmin]);

  // Run once on mount
  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  return (
    <AdminAuthContext.Provider
      value={{ isAdmin, loading, error, checkAdmin, refreshValidation }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
