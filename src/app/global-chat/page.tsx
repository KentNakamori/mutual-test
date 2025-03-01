"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import GlobalChatMain from "@/components/features/global-chat/GlobalChatMain";

/**
 * 全体チャットページ (GlobalChatPage)
 * - Next.js 13+ のappディレクトリでのルーティング例: /global-chat
 */
export default function GlobalChatPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // もし認証必須のページなら、ログインチェックの上でリダイレクトなど行う処理を入れる
  // 例: ログイン必須 → 未ログインなら /login へ遷移 ...など

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        ログイン状態を確認しています...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* --- ヘッダーやサイドバーを共通Layoutで使う場合は、
             このページ内で <Layout>ラップ してもOKです ---
          <Layout>
            <GlobalChatMain />
          </Layout>
         のように構成する場合もあり
      */}

      {/* シンプルにコンテンツだけ表示する例 */}
      <header className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold">全体チャット (GlobalChat)</h1>
      </header>

      <main className="flex-1 p-4">
        <GlobalChatMain />
      </main>

      <footer className="bg-white border-t border-gray-200 p-4 text-sm text-center text-gray-500">
        © 2025 MyAwesomeApp
      </footer>
    </div>
  );
}
