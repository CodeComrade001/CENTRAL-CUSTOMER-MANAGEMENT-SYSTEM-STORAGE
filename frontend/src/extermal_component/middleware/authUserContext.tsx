// src/context/authContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { Api__User_Validate } from "@/services/api"; // your backend call to validate user

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  role: string | null;
  setRole: (r: string | null) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Optional: run once to auto-validate
  useEffect(() => {
    const validateUser = async () => {
      try {
        const res = await Api__User_Validate(); // your backend endpoint
        if (res.status === 200 && res.data.isAuthenticated) {
          setIsAuthenticated(true);
          setRole(res.data.role || null);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        role,
        setRole,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
