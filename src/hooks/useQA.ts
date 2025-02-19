// src/hooks/useQA.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchQAList,
  likeQA,
  bookmarkQA,
  searchQA,
} from "@/libs/api";
import {
  QAListRequest,
  QAListResponse,
  LikeQARequest,
  LikeQAResponse,
  BookmarkQARequest,
  BookmarkQAResponse,
  SearchQARequest,
  SearchQAResponse,
} from "@/types/api";

// 企業別 or 条件付きでQA一覧を取得
export function useQAList(params?: QAListRequest) {
  return useQuery<QAListResponse, Error>({
    queryKey: ["qaList", params],
    queryFn: () => fetchQAList(params),
    staleTime: 0,
  });
}

// QAに「いいね」
export function useLikeQA() {
  const queryClient = useQueryClient();

  return useMutation<LikeQAResponse, Error, LikeQARequest>({
    mutationFn: async (payload) => likeQA(payload),
    onSuccess: (_data, variables) => {
      // キャッシュ更新
      queryClient.invalidateQueries({ queryKey: ["qaList"] });
      queryClient.invalidateQueries({ queryKey: ["qaDetail", variables.qaId] });
    },
  });
}

// QAをブックマーク
export function useBookmarkQA() {
  const queryClient = useQueryClient();

  return useMutation<BookmarkQAResponse, Error, BookmarkQARequest>({
    mutationFn: async (payload) => bookmarkQA(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["qaList"] });
      queryClient.invalidateQueries({ queryKey: ["qaDetail", variables.qaId] });
    },
  });
}

// 横断検索
export function useQASearch(params?: SearchQARequest) {
  return useQuery<SearchQAResponse, Error>({
    queryKey: ["qaSearch", params],
    queryFn: () => searchQA(params),
    staleTime: 0,
  });
}
