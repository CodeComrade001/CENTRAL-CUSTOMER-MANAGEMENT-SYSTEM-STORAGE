import { useEffect, useState, type ReactNode } from "react";
import { APi__Admin_ValidateAdmin } from "../../services/api";
import adminAuthContext from "./adminAuthContext";

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("user_token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    async function fetchUserVerification() {
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const validate = await APi__Admin_ValidateAdmin();
        if (validate.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Finish loading either way
      }
    }
    fetchUserVerification();
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("user_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <adminAuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        token,
        login,
        logout,
      }}
    >
      {!loading ? (
        children
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
      )}
    </adminAuthContext.Provider>
  );
};
