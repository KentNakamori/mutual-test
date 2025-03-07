"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CompanyHeader from '@/components/features/investor/company/CompanyHeader';
import TabSwitcher from '@/components/features/investor/company/TabSwitcher';
import ChatTabView from '@/components/features/investor/company/ChatTabView';
import QATabView from '@/components/features/investor/company/QATabView';

// 企業情報の型定義（必要に応じて /types からもインポート可能）
interface Company {
  companyId: string;
  companyName: string;
  industry: string;
  logoUrl?: string;
}

// モックの企業データ（実際は API 呼び出しで取得）
const mockCompanyData: Company = {
  companyId: "1",
  companyName: "Mock Company Inc.",
  industry: "Technology",
  logoUrl: "/company-logo.png",
};

/**
 * CompanyPage コンポーネント
 * 企業固有情報の取得、タブ切り替え（チャット / QA一覧）の管理を行います。
 */
const CompanyPage: React.FC = () => {
  const params = useParams();
  const { companyId } = params;
  
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"chat" | "qa">("chat");
  
  useEffect(() => {
    // ここで companyId を元に API から企業情報を取得（ここではモックデータを使用）
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
      <Header
        navigationLinks={[
          { label: "Home", href: "/" },
          { label: "Companies", href: "/companies" }
        ]}
        userStatus={{ isLoggedIn: true, userName: "John Doe" }}
        onClickLogo={() => { /* ロゴクリック時の処理 */ }}
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
      <Footer
        footerLinks={[
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" }
        ]}
        copyrightText="MyApp Inc."
      />
    </div>
  );
};

export default CompanyPage;
