//src\app\corporate\settings\page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

// 共通コンポーネントのインポート
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";


// ページ固有コンポーネントのインポート
import SettingsTabs from "@/components/features/corporate/settings/SettingsTabs";

// API 呼び出しと認証用カスタムフックのインポート
import { useCorporateCompanySettings } from "@/hooks/useCorporateCompanySettings";
import { useAuth } from "@/hooks/useAuth";

import { LayoutDashboard, HelpCircle, MessageSquare, Settings } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();

  // 企業基本情報取得用カスタムフック（モックデータ対応済み）
  const { companyInfo, isLoading, error, refetch } = useCorporateCompanySettings(token);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* サイドバー（Dashboardと全く同じ実装） */}
        <Sidebar
          menuItems={[
            { label: "ダッシュボード", link: "/corporate/dashboard", icon: <LayoutDashboard size={20} />},
            { label: "Q&A管理", link: "/corporate/qa", icon: <HelpCircle size={20} /> },
            { label: "IRチャット", link: "/corporate/irchat" , icon: <MessageSquare size={20} />},
            { label: "設定", link: "/corporate/settings", icon: <Settings size={20} />  },
          ]}
          isCollapsible
          // 現在のページなので selectedItem を "/corporate/settings" に設定
          selectedItem="/corporate/settings"
          onSelectMenuItem={(link) => router.push(link)}
        />

        {/* メインコンテンツ */}
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
