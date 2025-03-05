// hooks/useAuth.ts
import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const { state, dispatch } = useAuthContext();

  const loginSuccess = (token: string, userType: 'investor' | 'corporate', userId: string) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: { token, userType, userId } });
  };

  const guestLogin = (userId: string) => {
    dispatch({ type: 'GUEST_LOGIN', payload: { userId } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const refreshToken = (token: string) => {
    dispatch({ type: 'REFRESH_TOKEN', payload: { token } });
  };

  return {
    ...state,
    loginSuccess,
    guestLogin,
    logout,
    refreshToken,
  };
};
