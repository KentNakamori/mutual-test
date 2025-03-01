// src/app/login/page.tsx
import React from "react";
import SimpleHeader from "@/components/features/login/SimpleHeader";
import MainSectionClient from "@/components/features/login/MainSection";
import SimpleFooter from "@/components/features/login/SimpleFooter";

/**
 * LoginPage (Server Component)
 * - ヘッダー / フッター などの骨格はここに直接置きつつ、
 *   実際のフォーム操作は Client Component に分割する
 */
export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* シンプルヘッダー */}
      <SimpleHeader />

      {/* メインセクション (クライアントコンポーネント) */}
      {/* SSRでユーザ状態を取得してリダイレクトする等の処理が必要なら、Server Component側で判定して分岐します */}
      <main className="flex-grow">
        <MainSectionClient />
      </main>

      {/* シンプルフッター */}
      <SimpleFooter />
    </div>
  );
}
