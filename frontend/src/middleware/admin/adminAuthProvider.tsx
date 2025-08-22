// src/middleware/admin/AdminAuthProvider.tsx
import { useState, useEffect, useCallback, type ReactNode } from "react";
import { api__admin_validateAdmin } from "@/services/api";
import type { AxiosRequestConfig } from "axios";
import { AdminAuthContext } from "./adminAuthContext";
import { useNavigate } from "react-router-dom";

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = unknown
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // wrapped validator that always returns boolean and logs
  const checkAdmin = useCallback(async (config?: AxiosRequestConfig): Promise<boolean> => {

    setLoading(true);
    setError(null);

    // ensure we include credentials by default (caller may override)
    const cfg: AxiosRequestConfig = { withCredentials: true, ...(config || {}) };

    try {
      const res = await api__admin_validateAdmin(cfg);

      if (res.status === 200) {
        setIsAdmin(true);
        console.debug('[auth] setIsAdmin', true);
        return true;
      } else {
        setIsAdmin(false);
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {


      setIsAdmin(false);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized access");
        // do NOT navigate here for 401/403 — let UI decide where to go
        return false;
      } else {
        // For other errors we can navigate to login safely but prefer to set error
        setError("Server error occurred");
        // use absolute path
        navigate("/admin/signin", { replace: true });
        return false;
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Exposed refresh that callers can await
  const refreshValidation = useCallback(async (config?: AxiosRequestConfig) => {
    return checkAdmin(config);
  }, [checkAdmin]);

  // run once on mount but be safe against unmount races
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        await checkAdmin();
        if (!mounted) return;
        // keep state already set inside checkAdmin
        // nothing else needed
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [checkAdmin]);

  return (
    <AdminAuthContext.Provider
      value={{ isAdmin, loading, error, checkAdmin, refreshValidation }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
