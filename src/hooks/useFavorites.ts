// hooks/useFavorites.ts
'use client';
import { useMutation, useQueryClient } from 'react-query';
import { followInvestorCompany } from '../lib/api';
import { useUser } from "@auth0/nextjs-auth0";

export const useFavorites = () => {
  const { user } = useUser();
  const token = user?.sub ?? null;
  const queryClient = useQueryClient();

  // 企業フォロー状態変更のミューテーション
  const mutation = useMutation(
    ({ companyId, action }: { companyId: string; action: 'follow' | 'unfollow' }) => {
      if (!token) {
        return Promise.reject(new Error('認証トークンがありません'));
      }
      return followInvestorCompany(companyId, action, token);
    },
    {
      onSuccess: () => {
        // 企業リストと詳細のキャッシュを無効化（再取得を強制）
        queryClient.invalidateQueries(['investorCompanies']);
        queryClient.invalidateQueries(['investorCompanyDetail']);
      },
    }
  );

  // フォロー状態を切り替える関数
  const toggleFavorite = async (companyId: string, currentState: boolean) => {
    try {
      const action = currentState ? 'unfollow' : 'follow';
      const result = await mutation.mutateAsync({ companyId, action });
      return result;
    } catch (error) {
      console.error('企業フォロー状態変更エラー:', error);
      throw error;
    }
  };

  return {
    toggleFavorite,
    isLoading: mutation.isLoading,
    error: mutation.error
  };
};
