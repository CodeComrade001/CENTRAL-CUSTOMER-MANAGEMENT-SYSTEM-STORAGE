// authContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
