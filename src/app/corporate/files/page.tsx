'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import {
  LayoutDashboard,
  HelpCircle,
  MessageSquare,
  Settings,
  FileText,
} from 'lucide-react';

import { FileManagement } from '@/components/features/corporate/files/FileManagement';

// 共通 UI
import Sidebar from '@/components/common/sidebar';
import Footer from '@/components/common/footer';

const FilesPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: userLoading, error: userError } = useUser();

  /** ローディング or エラー表示 */
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }
  if (userError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">ログイン情報を取得できません</div>
      </div>
    );
  }

  /** 画面描画 */
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          menuItems={[
            { label: 'ダッシュボード', link: '/corporate/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'Q&A管理',       link: '/corporate/qa',        icon: <HelpCircle size={20} /> },
            { label: 'IRチャット',    link: '/corporate/irchat',    icon: <MessageSquare size={20} /> },
            { label: 'ファイル管理',  link: '/corporate/files',     icon: <FileText size={20} /> },
            { label: '設定',          link: '/corporate/settings',  icon: <Settings size={20} /> },
          ]}
          isCollapsible
          selectedItem="/corporate/files"
          onSelectMenuItem={(link) => router.push(link)}
        />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="mb-8 text-3xl font-bold">ファイル管理</h1>
          <FileManagement />
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: '利用規約',          href: '/terms' },
          { label: 'プライバシーポリシー', href: '/privacy' },
        ]}
        copyrightText="MyApp Inc."
        onSelectLink={(href) => router.push(href)}
      />
    </div>
  );
};

export default FilesPage; 