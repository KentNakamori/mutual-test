// src/app/investor/companies/followed/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";
import CompanyListing from '@/components/features/investor/companies/CompanyListing';
import { Company } from "@/types";
import { useGuest } from "@/contexts/GuestContext";
import GuestRestrictedContent from "@/components/features/investor/common/GuestRestrictedContent";
import { Home, Heart, Search, MessageSquare, User } from 'lucide-react';

interface ExtendedCompany extends Company {
  followed: boolean;
}

const mockCompanies: ExtendedCompany[] = [
  {
    companyId: "1",
    companyName: "株式会社A",
    industry: "テクノロジー",
    logoUrl: "/logoA.png",
    followed: true,
    securitiesCode: "1111",
    majorStockExchange: "Tokyo Stock Exchange",
    websiteUrl: "https://www.companya.co.jp",
  },
  {
    companyId: "2",
    companyName: "株式会社B",
    industry: "エネルギー",
    logoUrl: "/logoB.png",
    followed: false,
    securitiesCode: "2222",
    majorStockExchange: "Osaka Exchange",
    websiteUrl: "https://www.companyb.co.jp",
  },
  {
    companyId: "3",
    companyName: "株式会社C",
    industry: "ヘルスケア",
    logoUrl: "/logoC.png",
    followed: true,
    securitiesCode: "3333",
    majorStockExchange: "Tokyo Stock Exchange",
    websiteUrl: "https://www.companyc.co.jp",
  },
];

const FollowedCompaniesPage: React.FC = () => {
  const { isGuest } = useGuest();
  const [companies, setCompanies] = useState<ExtendedCompany[]>([]);
  const [searchQuery, setSearchQuery] = useState<{ keyword: string; industry?: string }>({ keyword: '', industry: '' });
  
  useEffect(() => {
    // ゲストユーザーの場合はデータを取得しない
    if (isGuest) return;
    
    const followed = mockCompanies.filter(company => company.followed);
    setCompanies(followed);
  }, [isGuest]);
  
  const handleSearchChange = (query: { keyword: string; industry?: string }) => {
    setSearchQuery(query);
    const filtered = mockCompanies.filter(company =>
      company.followed &&
      company.companyName.toLowerCase().includes(query.keyword.toLowerCase()) &&
      (query.industry ? company.industry.toLowerCase() === query.industry.toLowerCase() : true)
    );
    setCompanies(filtered);
  };

  const handleCardClick = (companyId: string) => {
    window.location.assign(`/investor/company/${companyId}`);
  };

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
          onSelectMenuItem={(link) => window.location.assign(link)}
        />
        <main className="flex-1 container mx-auto p-4 bg-gray-50">
          <h1 className="text-2xl font-semibold mb-2">フォロー済み企業</h1>
          
          {isGuest ? (
            <div className="mt-8">
              <GuestRestrictedContent featureName="フォロー済み企業" />
            </div>
          ) : (
            <CompanyListing />
          )}
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: "利用規約", href: "/terms" },
          { label: "プライバシーポリシー", href: "/privacy" },
        ]}
        copyrightText="MyCompany Inc."
      />
    </div>
  );
};

export default FollowedCompaniesPage;
