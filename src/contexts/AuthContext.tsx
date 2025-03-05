// contexts/AuthContext.tsx
import React, { createContext, useReducer, ReactNode, useContext } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userType: 'guest' | 'investor' | 'corporate' | null;
  userId: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  userType: null,
  userId: null,
};

export type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; userType: 'investor' | 'corporate'; userId: string } }
  | { type: 'GUEST_LOGIN'; payload: { userId: string } }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: { token: string } };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        isAuthenticated: true,
        token: action.payload.token,
        userType: action.payload.userType,
        userId: action.payload.userId,
      };
    case 'GUEST_LOGIN':
      return {
        isAuthenticated: true,
        token: null,
        userType: 'guest',
        userId: action.payload.userId,
      };
    case 'REFRESH_TOKEN':
      return { ...state, token: action.payload.token };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

interface AuthContextProps {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextProps {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext は AuthProvider 内で使用してください');
  }
  return context;
}
