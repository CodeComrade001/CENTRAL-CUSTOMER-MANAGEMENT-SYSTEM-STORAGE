import React, { type ReactNode, useReducer, useEffect } from "react";
import { initialState, appReducer } from "./AppContext";
import { adminAuthAppContext } from "./adminAuthAppContext";


export const AppProvider: React.FC<{ children: ReactNode; }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(savedUser) });
    }

  }, []);

  return (
    <adminAuthAppContext.Provider value={{ state, dispatch }}>
      {children}
    </adminAuthAppContext.Provider>
  );
};
