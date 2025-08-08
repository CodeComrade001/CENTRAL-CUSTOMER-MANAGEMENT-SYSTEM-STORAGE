import React, { createContext } from "react";
import { type AppState, type AppAction, initialState } from "./AppContext";



export const adminAuthAppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => { } });
