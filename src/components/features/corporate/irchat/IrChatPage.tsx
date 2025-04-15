"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/common/sidebar';
import ChatMessages from '@/components/ui/ChatMessages';
import ChatHistory, { ChatSession } from '@/components/ui/ChatHistory';
import ChatInputBox from '@/components/ui/ChatInputBox';
import Button from '@/components/ui/Button';
import { LayoutDashboard, HelpCircle, MessageSquare, Settings } from 'lucide-react';

// サイドバーメニューはそのまま使用（必要に応じて調整可能）
const sidebarMenuItems = [
  { label: "ダッシュボード", link: "/corporate/dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "Q&A管理", link: "/corporate/qa", icon: <HelpCircle size={20} /> },
  { label: "IRチャット", link: "/corporate/irchat", icon: <MessageSquare size={20} /> },
  { label: "設定", link: "/corporate/settings", icon: <Settings size={20} /> },
];

// モックデータ（例）
const mockSessions: ChatSession[] = [
  { sessionId: 's1', title: '案件A', lastMessageTimestamp: '2025-03-01T10:00:00Z' },
  { sessionId: 's2', title: '案件B', lastMessageTimestamp: '2025-03-02T12:30:00Z' },
  { sessionId: 's3', title: '案件C', lastMessageTimestamp: '2025-03-03T09:15:00Z' },
];

const mockMessages = [
  { messageId: 'm1', role: 'user', text: 'お疲れ様です。今日のミーティングは？', timestamp: '2025-03-03T10:00:00Z' },
  { messageId: 'm2', role: 'ai', text: '本日のミーティングは11時からです。', timestamp: '2025-03-03T10:00:05Z' },
];

export default function CorporateIRChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState(mockMessages);

  useEffect(() => {
    setSessions(mockSessions);
    setSelectedSessionId(mockSessions[0]?.sessionId ?? null);
  }, []);

  // セッション選択時のハンドラ
  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    // 必要に応じて選択したセッションのメッセージを取得する処理を実装
  };

  // 新規チャット作成のハンドラ
  const handleNewChat = () => {
    const newSession: ChatSession = {
      sessionId: `s${Date.now()}`,
      title: '新規チャット',
      lastMessageTimestamp: new Date().toISOString(),
    };
    setSessions(prev => [newSession, ...prev]);
    setSelectedSessionId(newSession.sessionId);
    setMessages([]); // 新規の場合は空のチャットからスタート
  };

  // チャット送信時のハンドラ
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMessage = {
      messageId: `m${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    // AI応答のシミュレーション
    setTimeout(() => {
      const aiMessage = {
        messageId: `m${Date.now() + 1}`,
        role: 'ai',
        text: 'こちらは自動生成された回答です。',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1">
        {/* サイドバーはデフォルトで閉じる設定 */}
        <Sidebar
          defaultCollapsed={true}
          menuItems={sidebarMenuItems}
          selectedItem="/corporate/irchat"
          onSelectMenuItem={(link) => window.location.assign(link)}
        />
        <main className="flex-1 bg-gray-50 flex">
          {/* 左側：チャット用サイドバー */}
          <div className="w-full md:w-64 border-r h-full flex flex-col">
            <div className="p-4">
              {/* 新規チャットボタン（投資家向けと同様のUI） */}
              <Button label="新規チャット" onClick={handleNewChat} variant="primary" />
              {/* ここにツール群（例：各種アクションボタン）の追加も可能 */}
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatHistory
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSelectSession={handleSelectSession}
              />
            </div>
          </div>
          {/* 右側：チャットエリア */}
          <div className="flex-1 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <ChatMessages messages={messages} />
            </div>
            <div className="border-t p-4">
              <ChatInputBox onSendMessage={handleSendMessage} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
