// hooks/useUserProfile.ts
import { useQuery, useQueryClient } from 'react-query';
import { getUser } from '../libs/api';
import { GetUserResponse } from '../types';
import { useAuth } from './useAuth';

export const useUserProfile = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: userProfile,
    isLoading,
    error,
    refetch,
  } = useQuery<GetUserResponse>(
    ['userProfile'],
    () => {
      if (!token) {
        return Promise.reject(new Error('認証トークンがありません'));
      }
      return getUser(token);
    },
    {
      enabled: !!token, // tokenが存在する場合のみクエリ実行
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    }
  );

  return { userProfile, isLoading, error, refetch, queryClient };
};
