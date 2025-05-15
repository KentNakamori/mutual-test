//src\app\investor\chat-logs\page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/common/sidebar';
import Footer from '@/components/common/footer';
import ChatLogsSearchBar from '@/components/features/investor/chat/ChatLogsSearchBar';
import ChatLogsList from '@/components/features/investor/chat/ChatLogsList';
import { ChatLog, FilterType } from '@/types';
import { useUser } from "@auth0/nextjs-auth0";
import { useGuest } from '@/contexts/GuestContext';
import GuestRestrictedContent from '@/components/features/investor/common/GuestRestrictedContent';
import { Home, Heart, Search, MessageSquare, User } from 'lucide-react';

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

// サイドバーのメニュー項目
const menuItems = [
  { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
  { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
  { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
  { label: 'チャットログ', link: '/investor/chat-logs', icon: <MessageSquare size={20} /> },
  { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
];

const ChatLogsPage: React.FC = () => {
  const { user, isLoading: userLoading } = useUser();
  const token = user?.sub ?? null;
  const { isGuest } = useGuest();
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterType>({});

  useEffect(() => {
    // ゲストユーザーの場合はAPIを呼び出さない
    if (isGuest) return;
    
    const fetchChatLogs = async () => {
      // 実際は token を利用して API から取得
      await new Promise((resolve) => setTimeout(resolve, 500));
      setChatLogs(mockChatLogs);
    };
    fetchChatLogs();
  }, [token, isGuest]);

  const handleSearch = useCallback((keyword: string, filter: FilterType) => {
    setSearchKeyword(keyword);
    setFilterOptions(filter);
    const filteredLogs = mockChatLogs.filter((log) =>
      log.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
      log.lastMessageSnippet.toLowerCase().includes(keyword.toLowerCase())
    );
    setChatLogs(filteredLogs);
  }, []);

  const handleDeleteLog = useCallback((chatId: string) => {
    setChatLogs((prevLogs) => prevLogs.filter((log) => log.chatId !== chatId));
  }, []);

  const handleArchiveLog = useCallback((chatId: string) => {
    setChatLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.chatId === chatId ? { ...log, isArchived: !log.isArchived } : log
      )
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー削除 → サイドバーに置き換え */}
      <div className="flex flex-1">
        <Sidebar
          isCollapsible
          menuItems={menuItems}
          selectedItem="/investor/chat-logs"
          onSelectMenuItem={(link) => (window.location.href = link)}
        />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">チャットログ一覧</h1>
          
          {isGuest ? (
            <div className="mt-8">
              <GuestRestrictedContent featureName="チャットログ" />
            </div>
          ) : (
            <>
              <ChatLogsSearchBar onSearch={handleSearch} initialKeyword={searchKeyword} />
              <ChatLogsList
                logs={chatLogs}
                onDeleteLog={handleDeleteLog}
                onArchiveLog={handleArchiveLog}
              />
            </>
          )}
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
