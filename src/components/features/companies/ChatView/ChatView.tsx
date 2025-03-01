// src/components/features/companies/ChatView/ChatView.tsx
"use client";

import React, { useState } from "react";
import FAQPanel from "./FAQPanel";
import ChatHistory from "./ChatHistory";
import ChatInputForm from "./ChatInputForm";
import { sendCompanyChat } from "@/libs/api";
import { ChatMessage } from "@/types/domain/chat";

/**
 * ChatView Props
 */
type ChatViewProps = {
  companyId: string;             // 現在の企業ID
};

const ChatView: React.FC<ChatViewProps> = ({ companyId }) => {
  // チャットメッセージ配列
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // 送信中フラグ
  const [isLoading, setIsLoading] = useState(false);
  // エラーメッセージ (モック用)
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * メッセージ送信
   */
  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    setErrorMessage("");

    // ユーザー側メッセージを先に履歴へ追加
    const newUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId: "temp-session",
      role: "user",
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMsg]);

    try {
      // 企業別チャット送信APIをコール
      const res = await sendCompanyChat(companyId, content);
      // AI回答を履歴へ追加
      const newAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sessionId: "temp-session",
        role: "ai",
        content: res.answer,
        references: res.references || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newAiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setErrorMessage("チャットAPIの呼び出しに失敗しました。モックメッセージを表示します。");

      // 失敗時: モックのAI回答を足す例
      const mockAiMsg: ChatMessage = {
        id: `ai-mock-${Date.now()}`,
        sessionId: "temp-session",
        role: "ai",
        content: "（モック）申し訳ありません。現在サーバーに接続できません。",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, mockAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * FAQをクリックした際にチャットへ反映
   */
  const handleSelectFAQ = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* 左側: FAQパネル */}
      <div className="md:w-1/4">
        <FAQPanel onSelectFAQ={handleSelectFAQ} />
      </div>

      {/* 右側: チャット本体 */}
      <div className="md:w-3/4 flex flex-col">
        {/* 履歴表示 */}
        <ChatHistory messages={messages} isLoading={isLoading} />
        {/* エラー表示 (任意) */}
        {errorMessage && (
          <div className="text-sm text-error mb-2">{errorMessage}</div>
        )}
        {/* 入力フォーム */}
        <ChatInputForm onSubmit={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatView;
