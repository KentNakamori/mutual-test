// src/app/investor/company/[companyId]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useUser } from "@auth0/nextjs-auth0";
import Sidebar from '@/components/common/sidebar';
import CompanyHeader from '@/components/features/investor/company/CompanyHeader';
import TabSwitcher from '@/components/features/investor/company/TabSwitcher';
import ChatTabView from '@/components/features/investor/company/ChatTabView';
import QATabView from '@/components/features/investor/company/QATabView';
import { Company } from '@/types';
import { Home, Heart, Search, MessageSquare, User } from 'lucide-react';
import { getInvestorCompanyDetail } from '@/lib/api';

const menuItems = [
  { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
  { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
  { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
  { label: 'チャットログ', link: '/investor/chat-logs', icon: <MessageSquare size={20} /> },
  { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
];

const CompanyPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { companyId } = params;
  
  // URLパラメータからtabとchatIdを取得
  const tabParam = searchParams.get('tab');
  const chatIdParam = searchParams.get('chatId');
  
  // Auth0 SDK v4の認証状態
  const { user, error: userError, isLoading: userLoading } = useUser();

  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  // URLパラメータに基づいて初期タブを設定
  const [activeTab, setActiveTab] = useState<"chat" | "qa">(
    tabParam === "chat" ? "chat" : "qa"
  );

  // ゲスト判定
  const isGuest = !user && !userLoading && !userError;

  // URLパラメータの変更を監視してタブを更新
  useEffect(() => {
    const newTab = tabParam === "chat" ? "chat" : "qa";
    setActiveTab(newTab);
  }, [tabParam]);

  useEffect(() => {
    // 認証状態がロード中の場合は処理しない
    if (userLoading) return;
    
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        // プロキシ経由でAPIリクエストを行う
        // token=undefinedにすることでプロキシ経由でJWTを送信
        // バックエンドで自動的にアクセストラッキングが行われる
        const response = await getInvestorCompanyDetail(companyId as string, undefined);
        
        // APIレスポンスをCompany型に変換
        const company: Company = {
          companyId: response.companyId,
          companyName: response.companyName,
          industry: response.industry,
          logoUrl: response.logoUrl,
          securitiesCode: response.securitiesCode,
          majorStockExchange: response.majorStockExchange,
          websiteUrl: response.websiteUrl,
        };
        
        setCompanyData(company);
        setError(null);
        
        // トラッキングは不要 - バックエンドで自動的に記録される
        console.log('ℹ️ 企業データ取得完了 - アクセストラッキングはバックエンドで自動実行されました');
      } catch (err) {
        console.error('企業データ取得エラー:', err);
        setError(err instanceof Error ? err : new Error('企業データの取得に失敗しました'));
      } finally {
        setLoading(false);
      }
    };
    
    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId, userLoading]); // pathnameを依存配列から削除

  const handleTabChange = (tab: "chat" | "qa") => {
    setActiveTab(tab);
    // URLパラメータを更新
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('tab', tab);
    
    // chatIdパラメータがある場合は保持、ない場合は削除
    if (tab === "chat" && chatIdParam) {
      newSearchParams.set('chatId', chatIdParam);
    } else if (tab === "qa") {
      newSearchParams.delete('chatId');
    }
    
    router.replace(`/investor/company/${companyId}?${newSearchParams.toString()}`);
  };

  // ローディング表示
  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">エラーが発生しました: {error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // データなし
  if (!companyData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">企業情報が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* サイドバー */}
      <Sidebar
        defaultCollapsed={true}
        menuItems={menuItems}
        selectedItem=""
        onSelectMenuItem={(link) => router.push(link)}
      />
      {/* 固定サイズの main エリア */}
      <main className="flex flex-col w-full h-screen bg-gray-50">
        <div className="px-6 pt-6">
          <CompanyHeader company={companyData} />
          <TabSwitcher activeTab={activeTab} onChangeTab={handleTabChange} />
        </div>
        {/* 固定された main 内で下部のみスクロール */}
        <div className="flex-1 overflow-hidden min-h-0">
          {activeTab === "chat" ? (
            <ChatTabView companyId={companyData.companyId} />
          ) : (
            <QATabView
              companyId={companyData.companyId}
              companyName={companyData.companyName}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyPage;
