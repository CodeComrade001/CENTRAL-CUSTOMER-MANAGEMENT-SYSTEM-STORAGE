import type { AxiosRequestConfig } from "axios";
import { createContext } from "react";

interface AdminAuthContextType {
  isAdmin: boolean | null; // null = unknown, true/false = validated
  loading: boolean;
  error: string | null;
  checkAdmin: (config?: AxiosRequestConfig) => Promise<boolean>;
  refreshValidation: () => void; // trigger re-check
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

