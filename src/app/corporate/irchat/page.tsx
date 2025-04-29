// src/app/corporate/irchat/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/common/sidebar';
import IrChatPage from '@/components/features/corporate/irchat/IrChatPage';
import { LayoutDashboard, HelpCircle, MessageSquare, Settings } from 'lucide-react';

// このページはクライアントコンポーネントとしてCSRで動作する
export default function IrChatPageRoute() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          defaultCollapsed={true}
          menuItems={[
            { label: "ダッシュボード", link: "/corporate/dashboard", icon: <LayoutDashboard size={20} /> },
            { label: "Q&A管理", link: "/corporate/qa", icon: <HelpCircle size={20} /> },
            { label: "IRチャット", link: "/corporate/irchat", icon: <MessageSquare size={20} /> },
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
