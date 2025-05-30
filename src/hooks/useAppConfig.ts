// hooks/useAppConfig.ts
// アプリケーションの設定を管理するフック

import { useAppConfigContext } from '../contexts/AppConfigContext';

export const useAppConfig = () => {
  const { state, dispatch } = useAppConfigContext();

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setLanguage = (language: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: { language } });
  };

  return { ...state, toggleTheme, setLanguage };
};
