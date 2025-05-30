// contexts/AppConfigContext.tsx
// アプリケーションの設定を管理するコンテキスト

import React, { createContext, useReducer, ReactNode, useContext } from 'react';

export interface AppConfigState {
  theme: 'light' | 'dark';
  language: string;
}

const initialState: AppConfigState = {
  theme: 'light',
  language: 'ja',
};

export type AppConfigAction =
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LANGUAGE'; payload: { language: string } };

function appConfigReducer(state: AppConfigState, action: AppConfigAction): AppConfigState {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload.language };
    default:
      return state;
  }
}

interface AppConfigContextProps {
  state: AppConfigState;
  dispatch: React.Dispatch<AppConfigAction>;
}

const AppConfigContext = createContext<AppConfigContextProps | undefined>(undefined);

export const AppConfigProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appConfigReducer, initialState);
  return <AppConfigContext.Provider value={{ state, dispatch }}>{children}</AppConfigContext.Provider>;
};

export function useAppConfigContext(): AppConfigContextProps {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error('useAppConfigContext は AppConfigProvider 内で使用してください');
  }
  return context;
}
