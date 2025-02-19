// src/hooks/useChat.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchChatLogs,
  deleteChatLog,
  archiveChatLog,
  fetchChatSessionDetail,
} from "@/libs/api";
import {
  ChatLogListRequest,
  ChatLogListResponse,
  DeleteChatLogRequest,
  DeleteChatLogResponse,
  ArchiveChatLogRequest,
  ArchiveChatLogResponse,
  ChatSessionDetailResponse,
} from "@/types/api";

// チャット一覧取得
export function useChatLogs(params?: ChatLogListRequest) {
  return useQuery<ChatLogListResponse, Error>({
    queryKey: ["chatLogs", params],
    queryFn: () => fetchChatLogs(params),
    staleTime: 0, // 必要に応じて設定
  });
}

// チャットセッション詳細 (メッセージ一覧)
export function useChatSessionDetail(sessionId?: string) {
  return useQuery<ChatSessionDetailResponse, Error>({
    queryKey: ["chatSessionDetail", sessionId],
    queryFn: () => {
      // sessionId が無い場合はリクエストしない
      if (!sessionId) {
        return Promise.reject(new Error("No sessionId provided"));
      }
      return fetchChatSessionDetail(sessionId);
    },
    enabled: !!sessionId, // sessionIdがあるときのみ実行
  });
}

// チャットログ削除
export function useDeleteChatLog() {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteChatLogResponse, // dataの型
    Error,                // エラーの型
    DeleteChatLogRequest  // 変数(引数)の型
  >({
    mutationFn: async (payload) => {
      return deleteChatLog(payload);
    },
    onSuccess: (_data, _variables) => {
      // キャッシュ無効化はオブジェクト形式で
      queryClient.invalidateQueries({ queryKey: ["chatLogs"] });
    },
  });
}

// チャットログアーカイブ
export function useArchiveChatLog() {
  const queryClient = useQueryClient();

  return useMutation<
    ArchiveChatLogResponse,
    Error,
    ArchiveChatLogRequest
  >({
    mutationFn: async (payload) => {
      return archiveChatLog(payload);
    },
    onSuccess: (_data, _variables) => {
      queryClient.invalidateQueries({ queryKey: ["chatLogs"] });
    },
  });
}
