// src/app/investor/companies/page.tsx
"use client";

import React, { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import Sidebar from '@/components/common/sidebar';
import Footer from '@/components/common/footer';
import NewQAList from '@/components/features/investor/companies/NewQAList';
import CompanyListing from '@/components/features/investor/companies/CompanyListing';
import { Home, Heart, Search, MessageSquare, User } from 'lucide-react';

const menuItems = [
  { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
  { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
  { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
  { label: 'チャットログ', link: '/investor/chat-logs', icon: <MessageSquare size={20} /> },
  { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
];

const CompaniesPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Auth0のuseUserフックを使用して認証状態を取得
  const { user, isLoading: userLoading, error: userError } = useUser();
  
  // CompanyListingから企業データを受け取るコールバック
  const handleCompaniesLoaded = useCallback((companies: Array<{ companyId: string }>) => {
    // トラッキングは不要なので、何もしない
  }, []);
  
  // ローディング表示
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          isCollapsible
          menuItems={menuItems}
          selectedItem="/investor/companies"
          onSelectMenuItem={(link) => router.push(link)}
        />
        <main className="flex-1 container mx-auto p-4 bg-gray-50">
          {/* 新着QAリスト：クリックすると QA 詳細モーダルが表示される */}
          <NewQAList />
          <h1 className="text-2xl font-semibold mb-2">企業一覧</h1>
          <CompanyListing 
            onCompaniesLoaded={handleCompaniesLoaded}
          />
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: '利用規約', href: '/terms' },
          { label: 'プライバシーポリシー', href: '/privacy' },
        ]}
        copyrightText="MyApp株式会社"
        onSelectLink={(href) => router.push(href)}
      />
    </div>
  );
};

export default CompaniesPage;