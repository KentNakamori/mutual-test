// src/hooks/useUserProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@auth0/nextjs-auth0';
import { getInvestorUser, updateInvestorUser } from '@/lib/api';

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
  const { user, isLoading: userLoading } = useUser();
  const qc = useQueryClient();

  /* --- 取得クエリ（v5 はオブジェクト構文のみ） --- */
  const { data, isLoading, error, refetch } = useQuery<InvestorProfile>({
    queryKey: ['investorProfile'],
    enabled: !!user,                     // user が取れてから実行
    staleTime: 300_000,
    queryFn: () => getInvestorUser(user!.sub),
  });

   /* --- 更新ミューテーション --- */
   const mutation = useMutation({
    mutationFn: (d: ProfileUpdateData) => updateInvestorUser(user!.sub, d),
    onSuccess: (updated) => {
      qc.setQueryData(['investorProfile'], updated.updatedProfile);
    },
  });

  return {
    userProfile: data,
    isLoading: isLoading || userLoading,
    error,
    refetch,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};