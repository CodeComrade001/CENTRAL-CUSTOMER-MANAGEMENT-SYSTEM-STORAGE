import type { User } from "@/utils/types";


export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
}

export type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }

export const initialState: AppState = {
  user: null,
  isAuthenticated: false,
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      return {
        ...initialState,
      };
    default:
      return state;
  }
};


