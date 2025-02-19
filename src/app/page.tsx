"use client";

import React from "react";
// 共通コンポーネント (既存想定)
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
// ページ固有コンポーネント
import MainContent from "@/components/features/home/MainContent";

// コンポーネントのprops型を定義
type NavigationLink = {
  label: string;
  href: string;
};

/**
 * トップページ (ルート "/")
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 共通ヘッダー */}
      <Header
        {...{
          navigationLinks: [
            { label: "ホーム", href: "/" },
            { label: "企業一覧", href: "/companies" },
          ],
        } as any}
      />

      {/* メインコンテンツ */}
      <main className="flex-grow">
        <MainContent />
      </main>

      {/* フッター */}
      <Footer
        {...{
          links: [
            { label: "利用規約", href: "/terms" },
            { label: "プライバシーポリシー", href: "/privacy" },
          ],
        } as any}
      />
    </div>
  );
}