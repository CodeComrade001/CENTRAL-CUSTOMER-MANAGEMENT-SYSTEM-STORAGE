import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  role: string;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: "",
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthContextType>({
    isAuthenticated: false,
    role: "",
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setAuth({ isAuthenticated: false, role: "", loading: false });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setAuth({ isAuthenticated: true, role: payload.role, loading: false });
    } catch {
      setAuth({ isAuthenticated: false, role: "", loading: false });
    }
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
