import { useEffect, useState, type ReactNode } from "react";
import { APi__Admin_ValidateAdmin } from "../../services/api";
import userAuthContext from "./userAuthContext";

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("user_token"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Validate user when token changes (or on first render)
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
        setLoading(false);
      }
    }

    fetchUserVerification();
  }, [token]); // rerun when token changes

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
    <userAuthContext.Provider
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
    </userAuthContext.Provider>
  );
};


