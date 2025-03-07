"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import ChatLogsSearchBar from '@/components/features//investor/chat/ChatLogsSearchBar';
import ChatLogsList from '@/components/features/investor/chat/ChatLogsList';
import { ChatLog, FilterType } from '@/types';
import { useAuth } from '@/hooks/useAuth';

// バックエンド未接続時用のモックデータ
const mockChatLogs: ChatLog[] = [
  {
    chatId: "1",
    companyName: "株式会社A",
    lastMessageSnippet: "こんにちは、どのようなご用件でしょうか？",
    updatedAt: "2025-03-06T12:00:00Z",
    isArchived: false,
  },
  {
    chatId: "2",
    companyName: "株式会社B",
    lastMessageSnippet: "ご報告書をご確認ください。",
    updatedAt: "2025-03-05T09:30:00Z",
    isArchived: false,
  },
  {
    chatId: "3",
    companyName: "株式会社C",
    lastMessageSnippet: "フィードバックありがとうございます。",
    updatedAt: "2025-03-04T15:45:00Z",
    isArchived: true,
  },
];

/**
 * ChatLogsPage コンポーネント
 * ・認証情報（useAuth）からトークンを取得し、API呼び出し時に利用可能
 * ・モックデータを用いてチャットログ一覧を表示し、検索・削除・アーカイブ操作をローカル状態で管理
 */
const ChatLogsPage: React.FC = () => {
  const { token } = useAuth();

  // チャットログ一覧、検索キーワード、フィルター設定のローカル状態
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterType>({});

  // コンポーネントマウント時にチャットログを取得（実際はAPI呼び出し）
  useEffect(() => {
    const fetchChatLogs = async () => {
      // 実際は token を利用して API から取得し、クエリパラメータ（searchKeyword, filterOptions）を送信
      // 今回は500msのディレイ後にモックデータをセット
      await new Promise((resolve) => setTimeout(resolve, 500));
      setChatLogs(mockChatLogs);
    };

    fetchChatLogs();
  }, [token]);

  // ChatLogsSearchBar からの検索イベントハンドラ
  const handleSearch = useCallback((keyword: string, filter: FilterType) => {
    setSearchKeyword(keyword);
    setFilterOptions(filter);
    // モックデータ内で簡易的にフィルタリング
    const filteredLogs = mockChatLogs.filter((log) =>
      log.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
      log.lastMessageSnippet.toLowerCase().includes(keyword.toLowerCase())
    );
    setChatLogs(filteredLogs);
  }, []);

  // チャットログの削除処理
  const handleDeleteLog = useCallback((chatId: string) => {
    // API削除呼び出し後、成功なら状態更新
    setChatLogs((prevLogs) => prevLogs.filter((log) => log.chatId !== chatId));
  }, []);

  // アーカイブ／アンアーカイブ処理
  const handleArchiveLog = useCallback((chatId: string) => {
    setChatLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.chatId === chatId ? { ...log, isArchived: !log.isArchived } : log
      )
    );
  }, []);

  // サイドバー・ヘッダー用のサンプルメニュー
  const sidebarMenuItems = [
    { label: 'ダッシュボード', link: '/dashboard' },
    { label: 'チャットログ', link: '/chat-logs' },
    { label: '設定', link: '/settings' },
  ];
  const headerNavigationLinks = [
    { label: 'ホーム', href: '/' },
    { label: '企業一覧', href: '/companies' },
    { label: 'プロフィール', href: '/profile' },
  ];

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        navigationLinks={headerNavigationLinks}
        userStatus={{ isLoggedIn: !!token, userName: "投資家ユーザー" }}
        onClickLogo={handleLogoClick}
      />
      <div className="flex flex-1">
        <Sidebar
          menuItems={sidebarMenuItems}
          selectedItem="/chat-logs"
          onSelectMenuItem={(link) => (window.location.href = link)}
        />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">チャットログ一覧</h1>
          <ChatLogsSearchBar onSearch={handleSearch} initialKeyword={searchKeyword} />
          <ChatLogsList
            logs={chatLogs}
            onDeleteLog={handleDeleteLog}
            onArchiveLog={handleArchiveLog}
          />
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: "利用規約", href: "/terms" },
          { label: "プライバシーポリシー", href: "/privacy" },
        ]}
        copyrightText="MyApp株式会社"
      />
    </div>
  );
};

export default ChatLogsPage;
