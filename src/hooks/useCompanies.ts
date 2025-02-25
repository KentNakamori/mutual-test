import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCompanies, toggleFollowCompany } from "@/libs/api";
import {
  CompanyListRequest,
  CompanyListResponse,
  FollowCompanyRequest,
  FollowCompanyResponse,
} from "@/types/api";

// Helper function to sanitize params for query key
function sanitizeQueryParams(params?: CompanyListRequest) {
  if (!params) return undefined;
  
  // Create a new object with only the serializable properties
  const sanitized: Record<string, unknown> = {};
  
  // Add only the properties you need for the query
  // Adjust these based on your CompanyListRequest type
  if ('page' in params) sanitized.page = params.page;
  if ('limit' in params) sanitized.limit = params.limit;
  if ('search' in params) sanitized.search = params.search;
  if ('sort' in params) sanitized.sort = params.sort;
  // Add other necessary fields...

  return sanitized;
}

export function useCompanies(params?: CompanyListRequest) {
  // Use sanitized params for query key, but pass original params to the fetch function
  return useQuery<CompanyListResponse, Error>({
    queryKey: ["companies", sanitizeQueryParams(params)],
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