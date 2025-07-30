import { useContext } from "react";
import userAuthContext from "./userAuthContext";

export function useUserAuth() {
  const context = useContext(userAuthContext);
  if (!context) throw new Error("useUserAuth must be used within UserAuthProvider");
  return context;
}
