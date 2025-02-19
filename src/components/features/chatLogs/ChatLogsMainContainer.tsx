"use client";

import React, { useState } from "react";
import { useChatLogs, useDeleteChatLog, useArchiveChatLog } from "@/hooks/useChat";
import ChatLogSearchBar from "./ChatLogSearchBar";
import ChatLogList from "./ChatLogList";

/**
 * チャットログ一覧ページのメインコンテナ
 */
export default function ChatLogsMainContainer() {
  // ローカルステート（検索条件、表示設定等）
  const [keyword, setKeyword] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState(1);

  // React Query フック
  const { data, error, isLoading } = useChatLogs({
    keyword,
    archive: showArchived,
    page,
    limit: 10,
  });

  const { mutate: deleteLog } = useDeleteChatLog();
  const { mutate: archiveLog } = useArchiveChatLog();

  // ハンドラ
  const handleSearch = () => {
    // ChatLogSearchBar から呼ばれたときに再リクエストするだけ
    setPage(1);
  };

  const handleDelete = (sessionId: string) => {
    if (!confirm("選択したチャットログを削除しますか？")) return;
    deleteLog({ sessionId });
  };

  const handleArchive = (sessionId: string) => {
    if (!confirm("選択したチャットログをアーカイブしますか？")) return;
    archiveLog({ sessionId });
  };

  // ページネーション制御
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* 検索バー */}
      <ChatLogSearchBar
        keyword={keyword}
        showArchived={showArchived}
        onChangeKeyword={(val) => setKeyword(val)}
        onToggleArchived={(checked) => setShowArchived(checked)}
        onSearch={handleSearch}
      />

      {/* ローディング/エラー/リスト表示 */}
      {isLoading && <p>Loading chat logs...</p>}
      {error && (
        <p className="text-error">Error: {(error as Error).message}</p>
      )}

      {!isLoading && !error && data && (
        <>
          <ChatLogList
            logs={data.data.map((session) => ({
              sessionId: session.id,
              title: session.title,
              companyId: session.companyId,
              updatedAt: session.updatedAt,
            }))}
            onClickItem={(sessionId) => {
              // クリックでチャット詳細へ遷移など
              alert(`Go to chat detail: ${sessionId}`);
            }}
            onDelete={handleDelete}
            onArchive={handleArchive}
          />

          {/* ページネーションの例 (必要に応じて) */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handlePrevPage}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              disabled={page <= 1}
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              onClick={handleNextPage}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
