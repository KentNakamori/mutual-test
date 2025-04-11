// src/components/features/investor/company/ChatTabView.tsx
"use client";

import React, { useState } from 'react';
import InvestorChatSidebar from './InvestorChatSidebar';
import ChatMessages from '@/components/ui/ChatMessages';
import ChatInputBox from '@/components/ui/ChatInputBox';
import { ChatMessage, ChatTabViewProps, ChatSession } from '@/types';

const ChatTabView: React.FC<ChatTabViewProps> = ({ companyId }) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { sessionId: '1', title: '案件A', lastMessageTimestamp: new Date().toISOString() },
    { sessionId: '2', title: '案件B', lastMessageTimestamp: new Date().toISOString() },
    { sessionId: '3', title: '案件C', lastMessageTimestamp: new Date().toISOString() },
  ]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(chatSessions[0]?.sessionId || '');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { messageId: "1", sender: "ai", text: "こんにちは。どのようなご質問でしょうか？", timestamp: new Date().toISOString() },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    // セッション切替時の追加処理があれば記述
  };
  
  const handleNewChat = () => {
    const now = new Date();
    const newSession = {
      sessionId: now.getTime().toString(),
      title: `新規チャット (${now.toLocaleDateString()} ${now.toLocaleTimeString()})`,
      lastMessageTimestamp: now.toISOString(),
    };
    setChatSessions(prev => [newSession, ...prev]);
    setSelectedSessionId(newSession.sessionId);
    setMessages([]);  // 新規チャットではメッセージクリア
  };
  
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      sender: "user",
      text: message,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          messageId: (Date.now() + 1).toString(),
          sender: "ai",
          text: "これはAIからの回答です。",
          timestamp: new Date().toISOString(),
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* 左側サイドバー：固定幅 */}
      <div className="w-full md:w-64 border-r h-full">
        <InvestorChatSidebar
          sessions={chatSessions}
          selectedSessionId={selectedSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
        />
      </div>
      {/* 右側チャットエリア） */}
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {/* 上部（チャットメッセージエリア）：スクロール対象 */}
        <div className="flex-1 overflow-y-auto">
          <ChatMessages
            messages={messages}
          />
        </div>
        {/* 下部（固定の入力欄） */}
        <div className="flex-shrink-0">
          <ChatInputBox onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatTabView;
