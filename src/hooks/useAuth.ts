import { useUser } from '@auth0/nextjs-auth0/client';

export const useAuth = () => {
  const { user, error, isLoading } = useUser();
  
  return {
    user,
    error,
    isLoading,
    isAuthenticated: !!user,
    token: user?.sub // Auth0のユーザーIDをトークンとして使用
  };
}; 