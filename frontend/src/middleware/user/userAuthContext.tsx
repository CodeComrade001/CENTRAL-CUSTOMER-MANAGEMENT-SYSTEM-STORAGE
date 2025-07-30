import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;

}

const userAuthContext = createContext<AuthContextType | undefined>(undefined);



export default userAuthContext;

