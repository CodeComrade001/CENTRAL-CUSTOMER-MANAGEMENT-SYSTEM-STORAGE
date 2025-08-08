import { useContext } from "react";
import { adminAppContext } from "./adminAppContext";



export const useAdminApp = () => {
  const context = useContext(adminAppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
