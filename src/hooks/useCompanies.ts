// src/hooks/useCompanies.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCompanies, toggleFollowCompany } from "@/libs/api";
import {
  CompanyListRequest,
  CompanyListResponse,
  FollowCompanyRequest,
  FollowCompanyResponse,
} from "@/types/api";

export function useCompanies(params?: CompanyListRequest) {
  return useQuery<CompanyListResponse, Error>({
    queryKey: ["companies", params],
    queryFn: () => fetchCompanies(params),
    // staleTime: 1000 * 60, など必要に応じて
  });
}

export function useToggleFollowCompany() {
  const queryClient = useQueryClient();

  return useMutation<
    FollowCompanyResponse,  // data
    Error,                  // error
    FollowCompanyRequest    // variables
  >({
    mutationFn: async (payload) => toggleFollowCompany(payload),
    onSuccess: (_data, variables) => {
      // フォロー状態が変わったので企業一覧などを再取得
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companyDetail", variables.companyId] });
    },
  });
}
