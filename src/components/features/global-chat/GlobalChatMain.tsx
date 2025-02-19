"use client";

import React, { useState, useEffect } from "react";
import { ChatHistoryPanelProps } from "@/types/components";
import GlobalChatHistory from "./GlobalChatHistory";
import GlobalChatInput from "./GlobalChatInput";
import ChatSessionList from "./ChatSessionList";
import { fetchChatLogs, sendChat, ChatResponse } from "@/libs/api";
import { ChatLogListResponse } from "@/types/api";
import { Nullable } from "@/types/utilities";

/**
 * 全体チャットページのメイン表示領域
 * - 既存セッション一覧
 * - 選択中のチャットログ or 新規チャット
 */
const GlobalChatMain: React.FC = () => {
  const [sessionList, setSessionList] = useState<ChatLogListResponse["data"]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatHistoryPanelProps["messages"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // ------------------------
  // セッション一覧を取得 (ログインユーザー前提などプロジェクト仕様に応じて)
  // ------------------------
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true);
        setError("");
        const result = await fetchChatLogs({ page: 1, limit: 10 }); // 適宜パラメータ調整
        setSessionList(result.data);
      } catch (err: any) {
        setError(err.message || "Failed to load chat sessions");
      } finally {
        setIsLoading(false);
      }
    };
    loadSessions();
  }, []);

  // ------------------------
  // ユーザーがセッションを選択した場合
  // ------------------------
  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    // TODO: sessionIdに応じてメッセージのロードなど
    // 今回サンプルではダミーとして messages をクリア or APIで取得してセット
    setMessages([]);
  };

  // ------------------------
  // 新規メッセージ送信
  // ------------------------
  const handleSendMessage = async (text: string) => {
    try {
      setIsLoading(true);
      setError("");

      const response: ChatResponse = await sendChat({
        message: text,
        // sessionId: selectedSessionId, // 既存セッション継続の場合
      });

      // UIに表示する用にメッセージをpush
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: text,
          timestamp: new Date().toISOString(),
        },
        {
          role: "ai",
          content: response.answer,
          timestamp: new Date().toISOString(),
        },
      ]);

      // 新規セッションの場合は newSessionId を反映
      if (response.newSessionId) {
        setSelectedSessionId(response.newSessionId);
      }
    } catch (err: any) {
      setError(err.message || "送信に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* サイド: 過去セッション一覧 (ログインユーザーのみ表示なども可) */}
      <div className="w-full md:w-1/3 bg-white border border-gray-200 rounded p-4">
        <h2 className="text-lg font-semibold mb-4">セッション一覧</h2>
        {error && <p className="text-error mb-2">{error}</p>}
        {isLoading && <p>読み込み中...</p>}

        {/* セッション一覧コンポーネント */}
        <ChatSessionList
          sessions={sessionList.map((s) => ({
            sessionId: s.sessionId,
            title: s.title,
            lastUpdated: s.updatedAt,
          }))}
          onSelectSession={handleSelectSession}
        />
      </div>

      {/* メイン: 選択中のチャット or 新規チャット */}
      <div className="flex-1 bg-white border border-gray-200 rounded p-4">
        <GlobalChatHistory messages={messages} isLoading={isLoading} />
        <div className="mt-4">
          <GlobalChatInput onSubmit={handleSendMessage} isDisabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default GlobalChatMain;
