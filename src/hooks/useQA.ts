// hooks/useQA.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchInvestorQa, searchInvestorCompanyQa, likeInvestorQa, getInvestorQaCompanies } from '../lib/api';
import { useUser } from "@auth0/nextjs-auth0";

export interface QASearchParams {
  keyword?: string;
  question_route?: string;
  categories?: string[];
  fiscalPeriod?: string[];
  companyId?: string;
  companyName?: string;
  sort?: 'createdAt' | 'likeCount';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CompanyQASearchParams {
  keyword?: string;
  question_route?: string;
  categories?: string[];
  fiscalPeriod?: string;
  is_faq?: boolean;
  sort?: 'createdAt' | 'likeCount';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface QAItem {
  qaId: string;
  title: string;
  question: string;
  answer: string;
  companyId: string;
  companyName: string;
  likeCount: number;
  question_route?: string;
  source?: string[];
  categories?: string[];
  fiscalPeriod?: string;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isFAQ?: boolean;
}

// 全体のQA検索
export const useQASearch = (queryParams: QASearchParams) => {
  const { user, isLoading: userLoading } = useUser();
  const token = user?.sub ?? null; 

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['qaSearch', queryParams],
    queryFn: () => searchInvestorQa(queryParams, token as string),
    enabled: !!token && !userLoading,
    staleTime: 5 * 60 * 1000,
  });

  return { 
    qaItems: data?.results ?? [],
    totalCount: data?.totalCount ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading, 
    error, 
    refetch 
  };
};

// 特定企業のQA検索
export const useCompanyQASearch = (
  companyId: string,
  queryParams: CompanyQASearchParams
) => {
  const { user, isLoading: userLoading } = useUser();
  const token = user?.sub ?? null;
  const isAuthenticated = !!token;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['companyQaSearch', companyId, queryParams],
    queryFn: () => searchInvestorCompanyQa(companyId, queryParams, token as string),
    enabled: !!companyId && !!token && isAuthenticated && !userLoading,
    staleTime: 5 * 60 * 1000,
  });

  return { 
    qaItems: data?.results || [], 
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    isLoading, 
    error, 
    refetch 
  };
};

// QA関連企業の取得
export const useQACompanies = () => {
  const { user, isLoading: userLoading } = useUser();
  const token = user?.sub ?? null;

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['qaCompanies'],
    queryFn: () => getInvestorQaCompanies(token as string),
    enabled: !!token && !userLoading,
    staleTime: 5 * 60 * 1000,
  });

  return { 
    companies: data || [], 
    isLoading, 
    error 
  };
};

// QAへのいいね/解除
export const useQALike = () => {
  const { user } = useUser();
  const token = user?.sub ?? null;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ qaId, action }: { qaId: string; action: 'ADD' | 'REMOVE' }) => {
      return likeInvestorQa(qaId, action, token as string);
    },
    onSuccess: () => {
      // QA関連のキャッシュを無効化（再取得を強制）
      queryClient.invalidateQueries({ queryKey: ['qaSearch'] });
      queryClient.invalidateQueries({ queryKey: ['companyQaSearch'] });
    },
  });

  const toggleLike = async (qaId: string, isCurrentlyLiked: boolean) => {
    const action = isCurrentlyLiked ? 'REMOVE' : 'ADD';
    return mutation.mutateAsync({ qaId, action });
  };

  return {
    toggleLike,
    isLoading: mutation.isPending,
    error: mutation.error
  };
};
