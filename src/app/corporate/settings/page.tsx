//src\app\corporate\settings\page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

// 共通コンポーネントのインポート
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import Footer from "@/components/common/Footer";

// ページ固有コンポーネントのインポート
import SettingsTabs from "@/components/features/corporate/settings/SettingsTabs";

// API 呼び出しと認証用カスタムフックのインポート
import { useCorporateCompanySettings } from "@/hooks/useCorporateCompanySettings";
import { useAuth } from "@/hooks/useAuth";

const SettingsPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();

  // 企業基本情報取得用カスタムフック（モックデータ対応済み）
  const { companyInfo, isLoading, error, refetch } = useCorporateCompanySettings(token);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <Header
        navigationLinks={[
          { label: "Dashboard", href: "/corporate/dashboard" },
          { label: "Q&A管理", href: "/corporate/qa" },
          { label: "設定", href: "/corporate/settings" },
        ]}
        userStatus={{ isLoggedIn: true, userName: "企業ユーザー" }}
        onClickLogo={() => router.push("/corporate/dashboard")}
      />

      <div className="flex flex-1">
        {/* サイドバー（Dashboardと全く同じ実装） */}
        <Sidebar
          menuItems={[
            { label: "Dashboard", link: "/corporate/dashboard" },
            { label: "Q&A管理", link: "/corporate/qa" },
            { label: "IRチャット", link: "/corporate/irchat" },
            { label: "設定", link: "/corporate/settings" },
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
