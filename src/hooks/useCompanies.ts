// src/lib/hooks/useCompanies.ts
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export function useCompanies() {
  const { data, error, isLoading } = useSWR<
    { id: number; name: string }[]
  >('/api/companies', fetcher);

  return {
    companies: data ?? [],
    isLoading: !error && (isLoading || !data),
    isError: error,
  };
}
