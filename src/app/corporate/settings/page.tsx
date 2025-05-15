"use client";

import React from "react";
import { useRouter } from "next/navigation";

// 共通コンポーネント
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";

// 企業向け設定用のコンポーネント
import SettingsTabs from "@/components/features/corporate/settings/SettingsTabs";

// API 接続と認証用のカスタムフック
import { useCorporateCompanySettings } from "@/hooks/useCorporateCompanySettings";
import { useUser } from "@auth0/nextjs-auth0";

import { LayoutDashboard, HelpCircle, MessageSquare, Settings } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();

  // useCorporateCompanySettings フックでバックエンド API から企業情報を取得
  const { companyInfo, isLoading, error, refetch } = useCorporateCompanySettings(token);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* サイドバー：ダッシュボード、Q&A管理、IRチャット、設定 */}
        <Sidebar
          menuItems={[
            { label: "ダッシュボード", link: "/corporate/dashboard", icon: <LayoutDashboard size={20} /> },
            { label: "Q&A管理", link: "/corporate/qa", icon: <HelpCircle size={20} /> },
            { label: "IRチャット", link: "/corporate/irchat", icon: <MessageSquare size={20} /> },
            { label: "設定", link: "/corporate/settings", icon: <Settings size={20} /> },
          ]}
          isCollapsible
          selectedItem="/corporate/settings"
          onSelectMenuItem={(link) => router.push(link)}
        />

        {/* メインコンテンツ部分 */}
        <main className="flex-1 p-6 bg-gray-50">
          {isLoading && <p>企業情報を取得中…</p>}
          {error && (
            <p className="text-red-600">
              Error: {error instanceof Error ? error.message : String(error)}
            </p>
          )}
          {companyInfo ? (
            <SettingsTabs companyInfo={companyInfo} refetchCompanyInfo={refetch} />
          ) : (
            !isLoading && <p>企業情報がありません。</p>
          )}
        </main>
      </div>

      {/* フッター */}
      <Footer
        footerLinks={[
          { label: "利用規約", href: "/terms" },
          { label: "プライバシーポリシー", href: "/privacy" },
        ]}
        copyrightText="MyApp Inc."
        onSelectLink={(href) => router.push(href)}
      />
    </div>
  );
};

export default SettingsPage;
