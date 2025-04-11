"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/common/sidebar';
import Footer from '@/components/common/footer';
import ChatMessages from '@/components/ui/ChatMessages'
import ChatHistory, { ChatSession } from '@/components/ui/ChatHistory';
import MailDraftModal from '@/components/features/corporate/irchat/MailDraftModal'; // 追加：メールドラフトモーダルのインポート
import Button from '@/components/ui/Button';
import { LayoutDashboard, HelpCircle, MessageSquare, Settings } from 'lucide-react';

const sidebarMenuItems = [
  { label: "ダッシュボード", link: "/corporate/dashboard", icon: <LayoutDashboard size={20} />},
  { label: "Q&A管理", link: "/corporate/qa", icon: <HelpCircle size={20} /> },
  { label: "IRチャット", link: "/corporate/irchat" , icon: <MessageSquare size={20} />},
  { label: "設定", link: "/corporate/settings", icon: <Settings size={20} />  },
];

// モックデータ（例）
const mockSessions: ChatSession[] = [
  { sessionId: 's1', title: '案件A', lastMessageTimestamp: '2025-03-01T10:00:00Z' },
  { sessionId: 's2', title: '案件B', lastMessageTimestamp: '2025-03-02T12:30:00Z' },
  { sessionId: 's3', title: '案件C', lastMessageTimestamp: '2025-03-03T09:15:00Z' },
];

const mockMessages: ChatMessage[] = [
  { messageId: 'm1', role: 'user', text: 'お疲れ様です。今日のミーティングは？', timestamp: '2025-03-03T10:00:00Z' },
  { messageId: 'm2', role: 'ai', text: '本日のミーティングは11時からです。', timestamp: '2025-03-03T10:00:05Z' },
];

export default function IrChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMailDraftOpen, setIsMailDraftOpen] = useState(false); // 追加：メールドラフトモーダルの表示状態

  useEffect(() => {
    // 初回ロード時にモックデータをセット
    setSessions(mockSessions);
    setSelectedSessionId(mockSessions[0]?.sessionId || null);
    setMessages(mockMessages);
  }, []);

  // チャット履歴のセッション選択ハンドラ
  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    // 実際は選択されたセッションのチャット履歴をAPIから取得する処理が必要
  };

  // 新規チャット追加ハンドラ
  const handleNewChat = () => {
    const newSession: ChatSession = {
      sessionId: `s${Date.now()}`,
      title: '新規チャット',
      lastMessageTimestamp: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setSelectedSessionId(newSession.sessionId);
    setMessages([]); // 新規チャットの場合、メッセージは空にする
  };

  // チャット送信ハンドラ
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMessage: ChatMessage = {
      messageId: `m${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    // AI応答のシミュレーション
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        messageId: `m${Date.now() + 1}`,
        role: 'ai',
        text: 'こちらは自動生成された回答です。',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  // 現在選択中のセッションを取得
  const selectedSession = sessions.find((session) => session.sessionId === selectedSessionId);
  const sessionTitle = selectedSession ? selectedSession.title : "チャット";

  // メールドラフトモーダルの開閉ハンドラ
  const handleOpenMailDraftModal = () => setIsMailDraftOpen(true);
  const handleCloseMailDraftModal = () => setIsMailDraftOpen(false);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1">
        <Sidebar
          menuItems={sidebarMenuItems}
          isCollapsible
          selectedItem="/corporate/irchat"
          onSelectMenuItem={(link) => window.location.assign(link)}
        />
        <main className="flex-1 bg-gray-50 flex">
          {/* 左側：上部1/3にメールドラフト作成ボタン、下部2/3にチャット履歴 */}
          <div className="w-1/3 h-full border-r flex flex-col">
            <div className="h-1/3 flex items-center justify-center p-4">
              <Button label="メールドラフト作成" onClick={handleOpenMailDraftModal} variant="gradient" />
            </div>
            <div className="h-2/3">
              <ChatHistory
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSelectSession={handleSelectSession}
                onNewChat={handleNewChat}
              />
            </div>
          </div>
          {/* 右側：チャットエリア（全体の2/3） */}
          <div className="w-2/3 h-full">
            <ChatArea
              messages={messages}
              onSendMessage={handleSendMessage}
              chatTitle={sessionTitle}  // 追加：表題を渡す
            />
          </div>
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: '利用規約', href: '/terms' },
          { label: '問い合わせ', href: '/contact' },
        ]}
        copyrightText="MyCompany Inc."
        onSelectLink={(href) => window.location.assign(href)}
      />
       {isMailDraftOpen && (
      <MailDraftModal isOpen={isMailDraftOpen} onClose={handleCloseMailDraftModal} />
    )}
    </div>
  );
}
