// src/components/features/corporate/irchat/IrChatPage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../../../common/Sidebar';
import Footer from '../../../common/Footer';
import DraftList from './DraftList';
import ChatWindow from './ChatWindow';
import MailDraftModal from './MailDraftModal';

// モックデータの型例（実際は types/index.ts 等に定義済み）
interface Draft {
  draftId: string;
  title: string;
  createdAt: string;
}
interface ChatMessage {
  messageId: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

// モックデータ例
const mockDrafts: Draft[] = [
  { draftId: '1', title: '案件Aのドラフト', createdAt: '2025-03-01T10:00:00Z' },
  { draftId: '2', title: '案件Bのドラフト', createdAt: '2025-03-02T12:30:00Z' },
  { draftId: '3', title: '案件Cのドラフト', createdAt: '2025-03-03T09:15:00Z' },
];

const mockMessages: ChatMessage[] = [
  { messageId: 'm1', role: 'user', text: 'お疲れ様です。今日のミーティングは？', timestamp: '2025-03-03T10:00:00Z' },
  { messageId: 'm2', role: 'ai', text: '本日のミーティングは11時からです。', timestamp: '2025-03-03T10:00:05Z' },
];

const sidebarMenuItems = [
  { label: 'dashboard', link: '/corporate/dashboard' },
  { label: 'Q&A管理', link: '/corporate/qa' },
  { label: 'チャット', link: '/corporate/irchat' },
  { label: '設定', link: '/corporate/settings' },
];

export default function IrChatPage() {
  // ページ全体のローカルステート
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMailDraftOpen, setIsMailDraftOpen] = useState(false);

  // 初回ロード時にモックデータをセット
  useEffect(() => {
    setDrafts(mockDrafts);
    setMessages(mockMessages);
    setSelectedDraftId(mockDrafts[0]?.draftId || null);
  }, []);

  // ドラフト選択時のハンドラ
  const handleSelectDraft = (draftId: string) => {
    setSelectedDraftId(draftId);
    // 実際はドラフトIDに応じたチャット履歴を取得するAPIコールを実行
    // ここではモックデータをそのまま利用
  };

  // チャット送信時のハンドラ
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    // ユーザー送信の新規メッセージを追加
    const newMessage: ChatMessage = {
      messageId: `m${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // AI応答のモック（実際はAPI呼び出し）
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        messageId: `m${Date.now() + 1}`,
        role: 'ai',
        text: 'こちらが自動生成された回答です。',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  // QA登録ボタン押下時のハンドラ
  const handleRegisterQA = () => {
    // QA登録処理を実装（API呼び出しなど）
    alert('QA登録処理を実行します。');
  };

  // メールドラフトモーダルの開閉ハンドラ
  const handleOpenMailDraftModal = () => setIsMailDraftOpen(true);
  const handleCloseMailDraftModal = () => setIsMailDraftOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* 共通Sidebar */}
        <Sidebar menuItems={sidebarMenuItems} selectedItem="/corporate/irchat" onSelectMenuItem={(link) => window.location.assign(link)} />
        {/* MainContent */}
        <main className="flex-1 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 左カラム：DraftList */}
            <div className="md:col-span-1">
              <DraftList drafts={drafts} selectedDraftId={selectedDraftId} onSelectDraft={handleSelectDraft} />
            </div>
            {/* 右カラム：ChatWindow */}
            <div className="md:col-span-2">
              <ChatWindow
                messages={messages}
                onSendMessage={handleSendMessage}
                onRegisterQA={handleRegisterQA}
                onCreateMailDraft={handleOpenMailDraftModal}
              />
            </div>
          </div>
        </main>
      </div>
      {/* 共通Footer */}
      <Footer footerLinks={[{ label: '利用規約', href: '/terms' }, { label: '問い合わせ', href: '/contact' }]} copyrightText="MyCompany Inc." />
      {/* メールドラフトモーダル */}
      <MailDraftModal isOpen={isMailDraftOpen} onClose={handleCloseMailDraftModal} />
    </div>
  );
}
