"use client";

import React, { useState, useEffect } from "react";
import { useChatLogs, useDeleteChatLog } from "@/hooks/useChat";
import type { ChatLogListRequest } from "@/types/api";
import ChatLogSearchBar from "./ChatLogSearchBar";
import ChatLogList from "./ChatLogList";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

/**
 * ChatLogItem の簡易型:
 * ここでは UI表示に必要なフィールドのみ定義しています。
 * 実際のAPIレスポンスに合わせて拡張してください。
 */
interface ChatLogItem {
  sessionId: string;
  title?: string;
  companyId?: string;
  updatedAt: string;
}

/**
 * ChatLogsMainContainer
 * - ページ内のメインコンテナ:
 *   1) 検索/フィルタ (ChatLogSearchBar)
 *   2) チャットログ一覧 (ChatLogList)
 *   3) 削除確認ダイアログ (ConfirmDeleteDialog)
 */
export default function ChatLogsMainContainer() {
  // ---------------------------
  // 1) 検索/フィルタ用のローカルステート
  // ---------------------------
  const [keyword, setKeyword] = useState<string>("");     // 検索キーワード
  const [showArchived, setShowArchived] = useState<boolean>(false); // アーカイブ含む？

  // ---------------------------
  // 2) API呼び出し (useChatLogs)
  // ---------------------------
  const { data, isLoading, error, refetch } = useChatLogs({
    keyword,
    archive: showArchived,
    // 必要に応じて page, limit など他のパラメータを追加
  } as ChatLogListRequest);

  // ---------------------------
  // 3) 一覧用ステート (APIデータ or モックデータ)
  // ---------------------------
  // ここで ChatLogItem[] | null の型を明示し、エラーを回避
  const [chatLogs, setChatLogs] = useState<ChatLogItem[] | null>(null);

  useEffect(() => {
    if (data && data.data) {
      // 本来はAPIレスポンス型とUI表示用型のマッピングが必要な場合もあるが、
      // ここでは同じ構造を想定して直接セット
      setChatLogs(data.data as ChatLogItem[]);
    }
  }, [data]);

  // ---------------------------
  // 4) 削除関連 (ConfirmDeleteDialog)
  // ---------------------------
  const [targetSessionId, setTargetSessionId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const deleteMutation = useDeleteChatLog();

  const handleDelete = (sessionId: string) => {
    setTargetSessionId(sessionId);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!targetSessionId) return;
    try {
      await deleteMutation.mutateAsync({ sessionId: targetSessionId });
      await refetch();
    } catch (err) {
      console.error("Failed to delete chat log:", err);
    } finally {
      setDialogOpen(false);
      setTargetSessionId(null);
    }
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setTargetSessionId(null);
  };

  // ---------------------------
  // 5) バックエンド接続エラー時にモックデータをセット
  // ---------------------------
  useEffect(() => {
    if (error) {
      console.warn("Failed to fetch chat logs from backend. Using mock data...");
      // 簡易モック
      const mockData: ChatLogItem[] = [
        {
          sessionId: "mock-1",
          title: "Mock Chat #1",
          companyId: "abc-company",
          updatedAt: new Date().toISOString(),
        },
        {
          sessionId: "mock-2",
          title: "Mock Chat #2",
          companyId: undefined,
          updatedAt: new Date().toISOString(),
        },
      ];
      setChatLogs(mockData);
    }
  }, [error]);

  // ---------------------------
  // 6) 一覧項目クリック (詳細画面へ遷移など)
  // ---------------------------
  const handleClickItem = (sessionId: string) => {
    // 例: ルーティングやモーダル表示など
    alert(`Move to chat detail: sessionId = ${sessionId}`);
  };

  // ---------------------------
  // JSX出力
  // ---------------------------
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Chatログ一覧</h1>

      {/* 検索バー */}
      <ChatLogSearchBar
        keyword={keyword}
        showArchived={showArchived}
        onChangeKeyword={(val) => setKeyword(val)}
        onToggleArchived={(checked) => setShowArchived(checked)}
        onSearch={() => {
          refetch();
        }}
      />

      {/* ローディング中 */}
      {isLoading && (
        <p className="text-gray-500 my-2">Loading Chat Logs...</p>
      )}

      {/* 一覧表示 */}
      {chatLogs && (
        <ChatLogList
          logs={chatLogs}
          onDelete={handleDelete}
          onClickItem={handleClickItem}
          onArchive={(sessionId) => {
            console.log("Archive not implemented. sessionId=", sessionId);
          }}
        />
      )}

      {/* ログが無い時 */}
      {!chatLogs?.length && !isLoading && (
        <p className="text-gray-600 mt-4">ログが見つかりません。</p>
      )}

      {/* 削除確認ダイアログ */}
      <ConfirmDeleteDialog
        isOpen={dialogOpen}
        title="チャットログ削除"
        message="このチャットログを削除します。よろしいですか？"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
