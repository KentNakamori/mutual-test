"use client";

import React from "react";
import { useRouter } from "next/navigation";

// 共通コンポーネント
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";

// 企業向け設定用のコンポーネント
import CompanyInfoForm from "@/components/features/corporate/settings/CompanyInfoForm";

// API 接続と認証用のカスタムフック
import { useCorporateCompanySettings } from "@/hooks/useCorporateCompanySettings";
import { useUser } from "@auth0/nextjs-auth0";

import { LayoutDashboard, Edit, MessageSquare, Settings, FileText } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isUserLoading, error: userError } = useUser();

  // useCorporateCompanySettings フックでバックエンド API から企業情報を取得
  const { companyInfo, isLoading: isCompanyInfoLoading, error: companyInfoError, refetch } = useCorporateCompanySettings();

  // Auth0からユーザー情報がロード中の場合の表示
  if (isUserLoading) {
    return <p>ユーザー情報を読み込み中...</p>;
  }

  // Auth0のユーザー情報取得でエラーが発生した場合の表示
  if (userError) {
    return <p>ユーザー情報の読み込みに失敗しました: {userError.message}</p>;
  }

  // ユーザーが認証されていない場合はログインページへリダイレクトなどの処理を検討
  if (!user) {
    // router.push('/api/auth/login'); // 例: ログインページへリダイレクト
    return <p>ログインしていません。ログインしてください。</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* サイドバー：ダッシュボード、Q&A管理、IRチャット、ファイル管理、設定 */}
        <Sidebar
          menuItems={[
            { label: "ダッシュボード", link: "/corporate/dashboard", icon: <LayoutDashboard size={20} /> },
            { label: "Q&A管理", link: "/corporate/qa", icon: <Edit size={20} /> },
            { label: "IRチャット", link: "/corporate/irchat", icon: <MessageSquare size={20} /> },
            { label: "ファイル管理", link: "/corporate/files", icon: <FileText size={20} /> },
            { label: "設定", link: "/corporate/settings", icon: <Settings size={20} /> },
          ]}
          isCollapsible
          selectedItem="/corporate/settings"
          onSelectMenuItem={(link) => router.push(link)}
        />

        {/* メインコンテンツ部分 */}
        <main className="flex-1 p-6 bg-gray-50">
          {isCompanyInfoLoading && <p>企業情報を取得中…</p>}
          {companyInfoError && (
            <p className="text-red-600">
              Error: {companyInfoError instanceof Error ? companyInfoError.message : String(companyInfoError)}
            </p>
          )}
          {companyInfo ? (
            <CompanyInfoForm initialData={companyInfo} onSaveSuccess={refetch} />
          ) : (
            !isCompanyInfoLoading && <p>企業情報がありません。</p>
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
