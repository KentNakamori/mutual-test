// hooks/useQA.ts
import { useQuery, useQueryClient } from 'react-query';
import { searchCorporateQa } from '../libs/api';
import { QA } from '../types';
import { useAuth } from './useAuth';

interface QAQueryParams {
  keyword: string;
  theme: string;
}

export const useQA = (queryParams: QAQueryParams) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: qaData,
    isLoading,
    error,
    refetch,
  } = useQuery<{ results: QA[]; totalCount: number }>(
    ['qaList', queryParams],
    () => {
      if (!token) return Promise.reject(new Error('認証トークンがありません'));
      return searchCorporateQa(token, queryParams);
    },
    { enabled: !!token }
  );

  return { qaData, isLoading, error, refetch, queryClient };
};
