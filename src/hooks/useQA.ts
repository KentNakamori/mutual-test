// hooks/useQA.ts
'use client'

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from 'react-query';
import { searchInvestorQa, searchInvestorCompanyQa, likeInvestorQa, getInvestorQaCompanies } from '../lib/api';
import { useUser } from "@auth0/nextjs-auth0";

export interface QASearchParams {
  keyword?: string;
  tag?: string;
  genre?: string[];
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
  tags?: string[];
  genre?: string[];
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
  tag?: string;
  tags?: string[];
  source?: string[];
  genre?: string[];
  fiscalPeriod?: string;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isFAQ?: boolean;
}

// 全体のQA検索
export const useQASearch = (queryParams: QASearchParams, options?: UseQueryOptions) => {
  const { user, isLoading: userLoading } = useUser();
  const token = user?.sub ?? null; 

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['qaSearch', queryParams],
    () => searchInvestorQa(queryParams, token as string),
    { 
      keepPreviousData: true
      ...options,
       
    }
  );

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
  queryParams: CompanyQASearchParams,
  options?: UseQueryOptions
) => {
  const { user, isLoading: userLoading } = useUser();
  const token          = user?.sub ?? null;
  const isAuthenticated = !!token;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['companyQaSearch', companyId, queryParams],
    () => searchInvestorCompanyQa(companyId, queryParams, token as string),
    { 
      enabled: !!companyId && !!token && isAuthenticated,
      ...options,
      keepPreviousData: true 
    }
  );

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
  } = useQuery(
    ['qaCompanies'],
    () => getInvestorQaCompanies(token as string),
    { 
      enabled: !!token && !userLoading,
    } 
  );

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

  const mutation = useMutation(
    ({ qaId, action }: { qaId: string; action: 'ADD' | 'REMOVE' }) => {
      return likeInvestorQa(qaId, action, token as string);
    },
    {
      onSuccess: () => {
        // QA関連のキャッシュを無効化（再取得を強制）
        queryClient.invalidateQueries('qaSearch');
        queryClient.invalidateQueries('companyQaSearch');
      },
    }
  );

  const toggleLike = async (qaId: string, isCurrentlyLiked: boolean) => {
    const action = isCurrentlyLiked ? 'REMOVE' : 'ADD';
    return mutation.mutateAsync({ qaId, action });
  };

  return {
    toggleLike,
    isLoading: mutation.isLoading,
    error: mutation.error
  };
};
