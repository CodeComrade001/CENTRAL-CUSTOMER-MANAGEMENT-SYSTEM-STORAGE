import { useContext } from "react";
import adminAuthContext from "./adminAuthContext";

export function useAminAuth() {
  const context = useContext(adminAuthContext);
  if (!context) throw new Error("useUserAuth must be used within UserAuthProvider");
  return context;
}
