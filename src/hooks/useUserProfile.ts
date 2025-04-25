// hooks/useUserProfile.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getInvestorUser, updateInvestorUser } from '../libs/api';
import { useUser } from '@auth0/nextjs-auth0/client';

export interface InvestorProfile {
  userId: string;
  displayName: string;
  email: string;
  investorType: string;
  investmentExperience: string;
  companyName?: string;
  assetManagementScale?: string;
  bio?: string;
}

export interface ProfileUpdateData {
  displayName?: string;
  investorType?: string;
  investmentExperience?: string;
  companyName?: string;
  assetManagementScale?: string;
  bio?: string;
}

export const useUserProfile = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const queryClient = useQueryClient();

  // プロファイル取得クエリ
  const {
    data: userProfile,
    isLoading,
    error,
    refetch,
  } = useQuery<InvestorProfile>(
    ['investorProfile'],
    () => {
      if (!user || !user.sub) {
        return Promise.reject(new Error('ユーザー情報がありません'));
      }
      // Auth0のユーザー情報からトークンやユーザーIDを取得する代わりに
      // APIで直接ユーザー情報を取得
      return getInvestorUser(user.sub);
    },
    {
      enabled: !!user?.sub, // ユーザーとサブIDが存在する場合のみクエリ実行
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    }
  );

  // プロファイル更新ミューテーション
  const mutation = useMutation(
    (updateData: ProfileUpdateData) => {
      if (!user || !user.sub) {
        return Promise.reject(new Error('ユーザー情報がありません'));
      }
      return updateInvestorUser(user.sub, updateData);
    },
    {
      onSuccess: (data) => {
        // 更新成功時にキャッシュを更新
        queryClient.setQueryData(['investorProfile'], data.updatedProfile);
      },
    }
  );

  // プロファイル更新関数
  const updateProfile = async (updateData: ProfileUpdateData) => {
    try {
      const result = await mutation.mutateAsync(updateData);
      return result;
    } catch (error) {
      console.error('プロファイル更新エラー:', error);
      throw error;
    }
  };

  return { 
    userProfile, 
    isLoading: isLoading || isUserLoading, 
    error, 
    refetch,
    updateProfile,
    isUpdating: mutation.isLoading
  };
};
