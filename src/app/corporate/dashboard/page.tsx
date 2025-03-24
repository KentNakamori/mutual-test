// src/app/corporate/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";

// 共通コンポーネントのインポート
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";

// ダッシュボード固有コンポーネントのインポート
import DashboardStats from "@/components/features/corporate/dashboard/DashboardStats";
import FilterBar from "@/components/features/corporate/dashboard/FilterBar";
import DashboardGraphs from "@/components/features/corporate/dashboard/DashboardGraphs";
import DashboardQnAList from "@/components/features/corporate/dashboard/DashboardQnAList";

// API 呼び出しと認証用カスタムフックのインポート
import { getCorporateDashboard } from "@/libs/api";
import { useAuth } from "@/hooks/useAuth";

// --- 型定義 ---
interface QAItem {
  id: string;
  title: string;
  createdAt: string;
  views: number;
}

export interface GraphDataItem {
  date: string;
  access: number;
  chatCount: number;
}

interface DashboardData {
  stats: {
    label: string;
    value: number;
    unit?: string;
  }[];
  graphData: GraphDataItem[];
  qas: {
    published: QAItem[];
    drafts: QAItem[];
    hot: QAItem[];
  };
}

const DashboardPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
 
  const [filter, setFilter] = useState<{ period: string }>({
    period: "monthly",
  });


  const { data, isLoading, error } = useQuery<DashboardData, Error>(
    ["dashboardData", filter],
    () => {
      if (!token) return Promise.reject(new Error("認証トークンがありません"));
      return getCorporateDashboard(token, filter);
    },
    {
      enabled: !!token,
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    }
  );

  const handleFilterChange = (newFilter: { period: string }) => {
    setFilter(newFilter);
  };
  

  const handleQACardClick = (qaId: string) => {
    router.push(`/corporate/qa/${qaId}`);
  };

  // バックエンド接続がない場合用のモックデータ
  const dashboardData: DashboardData = data || {
    stats: [
      { label: "アクセス数", value: 1200, unit: "回" },
      { label: "チャット質問数", value: 350, unit: "件" },
      { label: "公開Q&A数", value: 50, unit: "件" },
    ],
    graphData: [
      { date: "2025-02-01", access: 100, chatCount: 20 },
      { date: "2025-02-02", access: 150, chatCount: 30 },
      { date: "2025-02-03", access: 200, chatCount: 40 },
    ],
    qas: {
      published: [
        { id: "qa1", title: "Q&A 1", createdAt: "2025-02-10", views: 100 },
        { id: "qa2", title: "Q&A 2", createdAt: "2025-02-12", views: 150 },
      ],
      drafts: [
        { id: "qa3", title: "Draft Q&A", createdAt: "2025-02-15", views: 0 }
      ],
      hot: [
        { id: "qa2", title: "Q&A 2", createdAt: "2025-02-12", views: 150 }
      ],
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* サイドバー */}
        <Sidebar
          menuItems={[
            { label: "Dashboard", link: "/corporate/dashboard" },
            { label: "Q&A管理", link: "/corporate/qa" },
            { label: "IRチャット", link: "/corporate/irchat" },
            { label: "設定", link: "/corporate/settings" },
          ]}
          isCollapsible
          selectedItem="/corporate/dashboard"
          onSelectMenuItem={(link) => router.push(link)}
        />
        {/* メインコンテンツ */}
        <main className="flex-1 p-6 bg-gray-50">
          {/* タイトルと上部余白 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">ダッシュボード</h1>
          </div>
          <FilterBar initialFilter={filter} onFilterChange={handleFilterChange} />
          <DashboardStats statsData={dashboardData.stats} />
          <DashboardGraphs graphData={dashboardData.graphData} />
          <DashboardQnAList
            publishedQAs={dashboardData.qas.published}
            draftQAs={dashboardData.qas.drafts}
            hotQAs={dashboardData.qas.hot}
            onSelectQA={handleQACardClick}
          />
          {isLoading && <p>Loading...</p>}
          {error && (
            <p className="text-red-600">
              Error: {error instanceof Error ? error.message : "Unknown error"}
            </p>
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

export default DashboardPage;
