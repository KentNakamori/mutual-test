// src/app/investor/company/[companyId]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/common/sidebar';
import CompanyHeader from '@/components/features/investor/company/CompanyHeader';
import TabSwitcher from '@/components/features/investor/company/TabSwitcher';
import ChatTabView from '@/components/features/investor/company/ChatTabView';
import QATabView from '@/components/features/investor/company/QATabView';
import { Company } from '@/types';
import { Home, Heart, Search, MessageSquare, User } from 'lucide-react';

const mockCompanyData: Company = {
  companyId: "1",
  companyName: "Mock Company Inc.",
  industry: "Technology",
  logoUrl: "/company-logo.png",
  securitiesCode: "1234",
  majorStockExchange: "Tokyo Stock Exchange",
  websiteUrl: "https://www.mockcompany.com",
};

const menuItems = [
  { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
  { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
  { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
  { label: 'チャットログ', link: '/investor/chat-logs', icon: <MessageSquare size={20} /> },
  { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
];

const CompanyPage: React.FC = () => {
  const params = useParams();
  const { companyId } = params;

  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"chat" | "qa">("chat");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCompanyData(mockCompanyData);
      setLoading(false);
    }, 1000);
  }, [companyId]);

  const handleTabChange = (tab: "chat" | "qa") => {
    setActiveTab(tab);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          defaultCollapsed={true}
          menuItems={menuItems}
          selectedItem=""
          onSelectMenuItem={(link) => window.location.href = link}
        />
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <CompanyHeader company={companyData!} />
          <TabSwitcher activeTab={activeTab} onChangeTab={handleTabChange} />
          <div className="flex-1 flex"></div>
          {activeTab === "chat" ? (
            <ChatTabView companyId={companyData!.companyId} />
          ) : (
            <QATabView
              companyId={companyData!.companyId}
              companyName={companyData!.companyName}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default CompanyPage;
