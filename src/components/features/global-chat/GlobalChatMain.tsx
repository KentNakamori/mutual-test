"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChatLogs, useChatSessionDetail } from "@/hooks/useChat";
import { sendChat } from "@/libs/api";
import { ChatResponse } from "@/types/api";
import GlobalChatHistoryPanel from "./GlobalChatHistoryPanel";
import GlobalChatMessagesArea from "./GlobalChatMessagesArea";
import GlobalChatInput from "./GlobalChatInput";

/**
 * 全体チャット機能のメインコンテナ
 * - 履歴一覧(オプション) + チャット表示エリア + 入力フォーム
 */
const GlobalChatMain: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // ログイン済みなら、過去チャット履歴を使うかもしれない
  // useChatLogs: カスタムフック (例: 全セッション一覧を取得)
  // ただし、ゲストは履歴が無い場合が多いので条件分岐
  const chatLogsQuery = useChatLogs(isAuthenticated ? { page: 1, limit: 20 } : undefined);

  // ユーザーが選択したセッションID（過去履歴を開く）
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // セッション詳細(メッセージ一覧)を取得
  const sessionDetailQuery = useChatSessionDetail(selectedSessionId ?? undefined);

  // 現在画面に表示しているチャットメッセージ配列
  //  - 選択したセッションのメッセージ or 新規チャット中のメッセージ
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string; timestamp: string; id?: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------
  // 履歴一覧からセッションを選んだとき
  // ---------------------------
  useEffect(() => {
    if (sessionDetailQuery.data) {
      // chatMessagesを変換して表示用に
      const converted = sessionDetailQuery.data.messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.createdAt,
        id: m.id,
      }));
      setMessages(converted);
    }
  }, [sessionDetailQuery.data]);

  // ---------------------------
  // メッセージ送信処理
  // ---------------------------
  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // 1) 先にユーザーメッセージを表示に追加
        const newUserMsg = {
          role: "user" as const,
          content: userMessage,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newUserMsg]);

        // 2) API呼び出し
        //    - sessionIdがある場合: そこに追加送信
        //    - 無い場合: 新規チャット
        const payload = {
          message: userMessage,
          sessionId: selectedSessionId || undefined,
        };
        let res: ChatResponse;
        try {
          res = await sendChat(payload);
        } catch (apiErr: any) {
          // 例: バックエンド未接続の場合はモック回答を返す
          // eslint-disable-next-line no-console
          console.warn("Backend unreachable. Using mock response...", apiErr);
          res = {
            answer: "【モック回答】サーバーが未接続のため、仮のAI回答を表示しています。",
            references: ["https://example.com/fallback"],
            newSessionId: selectedSessionId || "mock-session-id",
          };
        }

        // 3) AIからの回答を messages に追加
        const aiMsg = {
          role: "ai" as const,
          content: res.answer,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);

        // 新規セッションIDが発行された場合は stateを更新
        if (res.newSessionId && !selectedSessionId) {
          setSelectedSessionId(res.newSessionId);
        }
      } catch (err: any) {
        setError(err.message || "送信に失敗しました");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedSessionId]
  );

  // ---------------------------
  // セッションを選択したとき
  // ---------------------------
  const handleSelectSession = useCallback((sessionId: string) => {
    setSelectedSessionId(sessionId);
  }, []);

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      {/* ===============================
          左側: 履歴パネル (ログイン済み時のみ表示する例)
      =============================== */}
      {isAuthenticated && (
        <div className="md:w-1/4">
          <GlobalChatHistoryPanel
            sessions={chatLogsQuery.data?.data || []}
            isLoading={chatLogsQuery.isLoading}
            onSelectSession={handleSelectSession}
            selectedSessionId={selectedSessionId || ""}
          />
        </div>
      )}

      {/* ===============================
          右側: メインのチャット表示
      =============================== */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-4 bg-white">
          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 text-red-600 p-2 mb-2 rounded">
              {error}
            </div>
          )}

          {/* メッセージ一覧 */}
          <GlobalChatMessagesArea
            messages={messages}
            isLoading={isLoading}
          />
        </div>

        {/* 入力フォーム */}
        <div className="mt-4">
          <GlobalChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="質問を入力してください..."
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalChatMain;
