"use client";

import React from "react";
// Layoutやヘッダーなど、共通レイアウトを使うならここでimport
// import Layout from "@/components/common/Layout"; // プロジェクトの構成に合わせて

import ChatLogsMainContainer from "@/components/features/chat/ChatLogsMainContainer";

/**
 * Chatログ一覧ページ
 * - /chat/logs のURLに対応
 * - 認証ユーザー向け
 */
export default function ChatLogsPage() {
  // もしSSRリダイレクト等を行いたい場合は、下記のようにserver component + cookies判定などを実装する
  // 今回はシンプルにCSRでuseAuthを想定。
  //
  // const { isAuthenticated } = useAuth();
  // if (!isAuthenticated) {
  //   // もし認証必須ならリダイレクト or ログインページ誘導
  //   return <RedirectToLogin />;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 共通ヘッダーやSidebarを含むレイアウトでラップするならこんな感じ
        <Layout>
          <ChatLogsMainContainer />
        </Layout>
      */}
      {/* 単にコンテナだけ表示するなら: */}
      <ChatLogsMainContainer />
    </div>
  );
}
