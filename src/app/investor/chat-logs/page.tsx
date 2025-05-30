//src\app\investor\chat-logs\page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/common/sidebar';
import Footer from '@/components/common/footer';
import ChatLogsSearchBar from '@/components/features/investor/chat/ChatLogsSearchBar';
import ChatLogsList from '@/components/features/investor/chat/ChatLogsList';
import { ChatLog, FilterType } from '@/types';
import { useUser } from "@auth0/nextjs-auth0";
import GuestRestrictedContent from '@/components/features/investor/common/GuestRestrictedContent';
import { getInvestorChatLogs, deleteInvestorChat } from '@/lib/api';
import { Home, Heart, Search, MessageSquare, User } from 'lucide-react';

// サイドバーのメニュー項目
const menuItems = [
  { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
  { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
  { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
  { label: 'チャットログ', link: '/investor/chat-logs', icon: <MessageSquare size={20} /> },
  { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
];

const ChatLogsPage: React.FC = () => {
  const { user, error: userError, isLoading: userLoading } = useUser();
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterType>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // ゲスト判定
  const isGuest = !user && !userLoading && !userError;
  // 認証エラー判定
  const isAuthError = !user && !userLoading && userError;

  // チャットログ取得関数
  const fetchChatLogs = useCallback(async (query?: {
    companyId?: string;
    page?: number;
    limit?: number;
  }) => {
    if (isGuest || userLoading || isAuthError) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('投資家チャットログ取得開始:', query);
      
      // プロキシ経由でJWTを送信（空文字列を渡す）
      const response = await getInvestorChatLogs(
        query || { page: 1, limit: 50 },
        '' // プロキシ経由でJWTを送信するため空文字列
      );
      
      console.log('投資家チャットログAPIレスポンス:', response);
      
      // APIレスポンスをChatLog型に変換
      const convertedLogs: ChatLog[] = response.chatLogs.map((log: any) => ({
        chatId: log.chatId,
        companyId: log.companyId,
        companyName: log.companyName,
        logoUrl: log.logoUrl,
        lastMessageSnippet: log.lastMessageSnippet || log.title || '新規チャット',
        updatedAt: log.updatedAt,
        totalMessages: log.totalMessages
      }));
      
      setChatLogs(convertedLogs);
    } catch (error) {
      console.error('チャットログの取得中にエラーが発生しました:', error);
      setError('チャットログの取得に失敗しました。');
      setChatLogs([]);
    } finally {
      setLoading(false);
    }
  }, [isGuest, userLoading, isAuthError]);

  // 初期データ取得
  useEffect(() => {
    if (!isGuest && !userLoading && !isAuthError) {
      fetchChatLogs();
    }
  }, [fetchChatLogs, isGuest, userLoading, isAuthError]);

  // 検索処理
  const handleSearch = useCallback(async (keyword: string, filter: FilterType) => {
    setSearchKeyword(keyword);
    setFilterOptions(filter);
    
    if (isGuest || isAuthError) return;
    
    // 検索条件に基づいてAPIを呼び出し
    const query: any = { page: 1, limit: 50 };
    
    // フィルターに企業IDが含まれている場合は追加
    if (filter.companyId) {
      query.companyId = filter.companyId;
    }
    
    await fetchChatLogs(query);
    
    // クライアントサイドでキーワード検索をフィルタリング
    if (keyword) {
      setChatLogs(prevLogs => 
        prevLogs.filter(log =>
          log.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          log.lastMessageSnippet.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
  }, [isGuest, isAuthError, fetchChatLogs]);

  // チャットログ削除処理
  const handleDeleteLog = useCallback(async (chatId: string) => {
    if (isGuest || isAuthError) return;
    
    try {
      console.log('チャットログ削除開始:', chatId);
      
      // 削除APIを呼び出し（プロキシ経由でJWTを送信）
      await deleteInvestorChat(chatId, '');
      
      // ローカルからも削除
      setChatLogs(prevLogs => prevLogs.filter(log => log.chatId !== chatId));
      console.log('チャットログ削除完了:', chatId);
    } catch (error) {
      console.error('チャットログの削除中にエラーが発生しました:', error);
      setError('チャットログの削除に失敗しました。');
    }
  }, [isGuest, isAuthError]);

  // ローディング表示
  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1">
          <Sidebar
            isCollapsible
            menuItems={menuItems}
            selectedItem="/investor/chat-logs"
            onSelectMenuItem={(link) => (window.location.href = link)}
          />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-600">読み込み中...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          isCollapsible
          menuItems={menuItems}
          selectedItem="/investor/chat-logs"
          onSelectMenuItem={(link) => (window.location.href = link)}
        />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">チャットログ一覧</h1>
          
          { (isGuest || isAuthError) ? (
            <div className="mt-8">
              <GuestRestrictedContent featureName="チャット機能" />
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <ChatLogsSearchBar 
                onSearch={handleSearch} 
                initialKeyword={searchKeyword}
                loading={loading}
              />
              
              {loading && !error ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">チャットログを読み込み中...</span>
                </div>
              ) : (
                <ChatLogsList
                  logs={chatLogs}
                  onDeleteLog={handleDeleteLog}
                />
              )}
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
