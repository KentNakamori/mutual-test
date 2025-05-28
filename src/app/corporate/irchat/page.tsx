// src/app/corporate/irchat/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import Sidebar from '@/components/common/sidebar';
import IrChatPage from '@/components/features/corporate/irchat/IrChatPage';
import { LayoutDashboard, HelpCircle, MessageSquare, Settings, FileText } from 'lucide-react';

// このページはクライアントコンポーネントとしてCSRで動作する
export default function IrChatPageRoute() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
  }

  if (error || !user) {
    return <div className="flex justify-center items-center h-screen">ログインが必要です</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          defaultCollapsed={true}
          menuItems={[
            { label: "ダッシュボード", link: "/corporate/dashboard", icon: <LayoutDashboard size={20} /> },
            { label: "Q&A管理", link: "/corporate/qa", icon: <HelpCircle size={20} /> },
            { label: "IRチャット", link: "/corporate/irchat", icon: <MessageSquare size={20} /> },
            { label: "ファイル管理", link: "/corporate/files", icon: <FileText size={20} /> },
            { label: "設定", link: "/corporate/settings", icon: <Settings size={20} /> },
          ]}
          isCollapsible
          selectedItem="/corporate/irchat"
          onSelectMenuItem={(link) => router.push(link)}
        />
        <main className="flex-1 bg-gray-50 flex flex-col">
          <div className="px-6 pt-6">
            <h1 className="text-3xl font-bold mb-4">IRチャット</h1>
          </div>
          <div className="flex-1">
            <IrChatPage />
          </div>
        </main>
      </div>
    </div>
  );
}
