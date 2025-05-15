// src/app/corporate/dashboard/page.tsx
'use client';                                                     // ① クライアント側で実行

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';             // ② 公式クライアントフック
import {
  LayoutDashboard,
  HelpCircle,
  MessageSquare,
  Settings,
} from 'lucide-react';

import {
  DashboardData,
  Filter,
} from '@/types';
import { getCorporateDashboard } from '@/lib/api';

// 共通 UI
import Sidebar from '@/components/common/sidebar';
import Footer from '@/components/common/footer';

// ダッシュボード専用 UI
import DashboardStats from '@/components/features/corporate/dashboard/DashboardStats';
import FilterBar from '@/components/features/corporate/dashboard/FilterBar';
import DashboardGraphs from '@/components/features/corporate/dashboard/DashboardGraphs';
import DashboardQnAList from '@/components/features/corporate/dashboard/DashboardQnAList';

const DashboardPage: React.FC = () => {
  const router = useRouter();

  /** ③ useUser() で認証状態を取得 */
  const { user, isLoading: userLoading, error: userError } = useUser();

  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError]     = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const [filter, setFilter] = useState<Filter>({ period: 'monthly' });

  /** ④ ダッシュボードデータ取得 */
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;                          // ① ログイン確認だけ
      try {
        setDashLoading(true);
        // ② user.sub と token を渡さない
        const data = await getCorporateDashboard({ period: filter.period });
        setDashboardData(data);
        setDashError(null);
      } catch (e) {
        console.error(e);
        setDashError('ダッシュボードデータの取得に失敗しました');
      } finally {
        setDashLoading(false);
      }
    };

    if (!userLoading && !userError) fetchData();
  }, [user, userLoading, userError, filter.period]);

  /** ⑥ ローディング or エラー表示 */
  if (userLoading || dashLoading) {
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
  if (dashError || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{dashError || 'データの取得に失敗しました'}</div>
      </div>
    );
  }

  /** ⑦ 画面描画 */
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          menuItems={[
            { label: 'ダッシュボード', link: '/corporate/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'Q&A管理',       link: '/corporate/qa',        icon: <HelpCircle size={20} /> },
            { label: 'IRチャット',    link: '/corporate/irchat',    icon: <MessageSquare size={20} /> },
            { label: '設定',          link: '/corporate/settings',  icon: <Settings size={20} /> },
          ]}
          isCollapsible
          selectedItem="/corporate/dashboard"
          onSelectMenuItem={(link) => router.push(link)}
        />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="mb-8 text-3xl font-bold">ダッシュボード</h1>
          <FilterBar initialFilter={filter} onFilterChange={setFilter} />
          <DashboardStats  statsData={dashboardData.stats[filter.period]} />
          <DashboardGraphs graphData={dashboardData.graphData[filter.period]} />
          <DashboardQnAList
            publishedQAs={dashboardData.qas.published}
            onSelectQA={(qaId) => router.push(`/corporate/qa/${qaId}`)}
          />
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

export default DashboardPage;
