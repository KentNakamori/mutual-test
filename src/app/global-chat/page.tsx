"use client";

import React from "react";
import GlobalChatMain from "@/components/features/global-chat/GlobalChatMain";

/**
 * 全体チャットページ (GlobalChatPage)
 * - 企業横断でQ&Aできるチャット機能を想定
 * - ログインユーザーでもゲストユーザーでも利用できるケースを想定
 */
export default function GlobalChatPage() {
  // Next.js 13+ でCSRを用いる例 (AIチャットはリアルタイムに動作させたい想定)
  // もしSSR等を適用する場合、`export const getServerSideProps = ...` ではなく
  // Route Handlersなどで実装検討

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">グローバルチャット</h1>
      <p className="text-gray-600 mb-6">
        ここでは、企業横断のQ&AをAIチャット形式で利用できます。
      </p>

      {/* ページ固有のメインコンポーネント */}
      <GlobalChatMain />
    </div>
  );
}
