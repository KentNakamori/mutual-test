"use client";

import React, { useState, useEffect } from "react";
import FAQPanel from "./FAQPanel";
import ChatHistory from "./ChatHistory";
import ChatInputForm from "./ChatInputForm";
// import { useChatSessionDetail, useChatLogs }など必要に応じて
// import { sendCompanyChat } from "@/libs/api"; // API呼び出しでメッセージ送信

interface ChatViewProps {
  companyId: string;
  // initialSessionId?: string;
}

export default function ChatView({ companyId }: ChatViewProps) {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string; timestamp: string }[]
  >([]);

  const handleSendMessage = async (text: string) => {
    // ここでAPI呼び出しなど
    // 例: setMessages([...messages, { role: "user", content: text, timestamp: new Date().toISOString() }]);
    // const response = await sendCompanyChat(companyId, text);
    // setMessages([...messages, { role: "ai", content: response.answer, timestamp: new Date().toISOString() }]);

    // デモ用に即時追加
    const now = new Date().toISOString();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, timestamp: now },
      { role: "ai", content: "AIのレスポンス (ダミー)", timestamp: now },
    ]);
  };

  // FAQのクリック時にチャット欄へ質問を反映などの例
  const handleFAQClick = (faqQuestion: string) => {
    handleSendMessage(faqQuestion);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* 左側: Chat本文 */}
      <div className="flex-1 flex flex-col gap-4">
        <ChatHistory messages={messages} />
        <ChatInputForm onSend={handleSendMessage} />
      </div>

      {/* 右側: FAQパネル (オプション) */}
      <div className="w-full md:w-64">
        <FAQPanel onSelectFAQ={handleFAQClick} />
      </div>
    </div>
  );
}
