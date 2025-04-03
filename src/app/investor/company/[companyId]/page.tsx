//src\app\investor\company\[companyId]\page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/common/sidebar';
import Footer from '@/components/common/footer';
import CompanyHeader from '@/components/features/investor/company/CompanyHeader';
import TabSwitcher from '@/components/features/investor/company/TabSwitcher';
import ChatTabView from '@/components/features/investor/company/ChatTabView';
import QATabView from '@/components/features/investor/company/QATabView';

interface Company {
  companyId: string;
  companyName: string;
  industry: string;
  logoUrl?: string;
}

const mockCompanyData: Company = {
  companyId: "1",
  companyName: "Mock Company Inc.",
  industry: "Technology",
  logoUrl: "/company-logo.png",
};

// サイドバーのメニュー項目
const menuItems = [
  { label: 'トップページ', link: '/investor/companies' },
  { label: "フォロー済み企業", link: "/investor/companies/followed" },
  { label: 'Q&A', link: '/investor/qa' },
  { label: 'チャットログ', link: '/investor/chat-logs' },
  { label: 'マイページ', link: '/investor/mypage' },
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
      {/* ヘッダー削除 → サイドバーに置き換え */}
      <div className="flex flex-1">
        <Sidebar
          isCollapsible
          menuItems={menuItems}
          selectedItem="" // このページは企業詳細なので特定のメニューをハイライトしない
          onSelectMenuItem={(link) => (window.location.href = link)}
        />
        <main className="flex-1 container mx-auto p-4">
          <CompanyHeader company={companyData!} />
          <TabSwitcher activeTab={activeTab} onChangeTab={handleTabChange} />
          {activeTab === "chat" ? (
            <ChatTabView companyId={companyData!.companyId} />
          ) : (
            <QATabView companyId={companyData!.companyId} />
          )}
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ]}
        copyrightText="MyApp Inc."
      />
    </div>
  );
};

export default CompanyPage;
