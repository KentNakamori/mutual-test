// src/app/investor/companies/followed/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";
import CompanyListing from '@/components/features/investor/companies/CompanyListing';
import GuestRestrictedContent from "@/components/features/investor/common/GuestRestrictedContent";
import { Home, Heart, Search, Logs, User } from 'lucide-react';

// APIレスポンスの型定義
interface CompanyItem {
  companyId: string;
  companyName: string;
  industry: string;
  logoUrl?: string;
  isFollowed: boolean;
  createdAt: string;
  updatedAt: string;
}

const FollowedCompaniesPage: React.FC = () => {
  const router = useRouter();
  const { user, error: userError, isLoading: userLoading } = useUser();
  
  // ゲスト判定
  const isGuest = !user && !userLoading && !userError;
  // 認証エラー判定（userLoadingが完了していて、userがいなく、かつuserErrorがある場合）
  const isAuthError = !user && !userLoading && userError;

  // ローディング表示
  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1">
          <Sidebar
            menuItems={[
              { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
              { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
              { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
              { label: 'チャットログ', link: '/investor/chat-logs', icon: <Logs size={20} /> },
              { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
            ]}
            isCollapsible
            selectedItem="/investor/companies/followed"
            onSelectMenuItem={(link) => router.push(link)}
          />
          <main className="flex-1 container mx-auto p-4 bg-gray-50 flex items-center justify-center">
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
          menuItems={[
            { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
            { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
            { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
            { label: 'チャットログ', link: '/investor/chat-logs', icon: <Logs size={20} /> },
            { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
          ]}
          isCollapsible
          selectedItem="/investor/companies/followed"
          onSelectMenuItem={(link) => router.push(link)}
        />
        <main className="flex-1 container mx-auto p-4 bg-gray-50">
          <h1 className="text-2xl font-semibold mb-2">フォロー済み企業</h1>
          
          { (isGuest || isAuthError) ? (
            <div className="mt-8">
              <GuestRestrictedContent featureName="フォロー機能" />
            </div>
          ) : (
            <CompanyListing isFollowedOnly={true} />
          )}
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: "利用規約", href: "/terms" },
          { label: "プライバシーポリシー", href: "/privacy" },
        ]}
        copyrightText="MyCompany Inc."
        onSelectLink={(href) => router.push(href)}
      />
    </div>
  );
};

export default FollowedCompaniesPage;
