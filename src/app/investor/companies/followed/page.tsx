// src/app/investor/companies/followed/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";
import CompanyListing from '@/components/features/investor/companies/CompanyListing';
import { Company } from "@/types";
import { useGuest } from "@/contexts/GuestContext";
import GuestRestrictedContent from "@/components/features/investor/common/GuestRestrictedContent";
import { Home, Heart, Search, MessageSquare, User } from 'lucide-react';
import { getInvestorCompanies } from "@/lib/api";

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
  const { isGuest } = useGuest();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 認証エラー表示
  if (userError && !isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">認証エラーが発生しました。再度ログインしてください。</div>
      </div>
    );
  }

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
          menuItems={[
            { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
            { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
            { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
            { label: 'チャットログ', link: '/investor/chat-logs', icon: <MessageSquare size={20} /> },
            { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
          ]}
          isCollapsible
          selectedItem="/investor/companies/followed"
          onSelectMenuItem={(link) => router.push(link)}
        />
        <main className="flex-1 container mx-auto p-4 bg-gray-50">
          <h1 className="text-2xl font-semibold mb-2">フォロー済み企業</h1>
          
          {isGuest ? (
            <div className="mt-8">
              <GuestRestrictedContent featureName="フォロー済み企業" />
            </div>
          ) : (
            // CompanyListingコンポーネントを使用（APIからデータ取得済み）
            // フォロー済み企業のフィルタリングはコンポーネント内で処理
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
