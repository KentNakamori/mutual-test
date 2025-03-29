// src/app/corporate/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// 共通コンポーネントのインポート
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";

// ダッシュボード固有コンポーネントのインポート
import DashboardStats from "@/components/features/corporate/dashboard/DashboardStats";
import FilterBar from "@/components/features/corporate/dashboard/FilterBar";
import DashboardGraphs from "@/components/features/corporate/dashboard/DashboardGraphs";
import DashboardQnAList from "@/components/features/corporate/dashboard/DashboardQnAList";

// --- 型定義 ---
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

// モック用のグラフデータ
const mockGraphDataDaily: GraphDataItem[] = [
  { date: "2025-03-01", access: 100, chatCount: 10 },
  { date: "2025-03-02", access: 120, chatCount: 12 },
  { date: "2025-03-03", access: 90, chatCount: 8 },
  { date: "2025-03-04", access: 130, chatCount: 15 },
  { date: "2025-03-05", access: 110, chatCount: 9 },
];

const mockGraphDataWeekly: GraphDataItem[] = [
  { date: "2025-W09", access: 1500, chatCount: 70 },
  { date: "2025-W10", access: 1800, chatCount: 90 },
  { date: "2025-W11", access: 2000, chatCount: 100 },
  { date: "2025-W12", access: 1700, chatCount: 80 },
];

const mockGraphDataMonthly: GraphDataItem[] = [
  { date: "2025-02", access: 10000, chatCount: 500 },
  { date: "2025-03", access: 12000, chatCount: 600 },
  { date: "2025-04", access: 8000, chatCount: 400 },
];

// フィルター値に応じたモックデータを返す関数
const getMockDashboardData = (period: string): DashboardData => {
  switch (period) {
    case "daily":
      return {
        stats: [
          { label: "アクセス数", value: 1000, unit: "回" },
          { label: "チャット質問数", value: 50, unit: "件" },
          { label: "公開Q&A数", value: 30, unit: "件" },
        ],
        graphData: mockGraphDataDaily,
        qas: {
          published: [
            { id: "qa1", title: "日別 Q&A 1", createdAt: "2025-03-02", views: 100 },
            { id: "qa2", title: "日別 Q&A 2", createdAt: "2025-03-03", views: 150 },
          ],
          drafts: [{ id: "qa3", title: "Draft Q&A", createdAt: "2025-03-04", views: 0 }],
          hot: [{ id: "qa2", title: "日別 Q&A 2", createdAt: "2025-03-03", views: 150 }],
        },
      };
    case "weekly":
      return {
        stats: [
          { label: "アクセス数", value: 7000, unit: "回" },
          { label: "チャット質問数", value: 350, unit: "件" },
          { label: "公開Q&A数", value: 210, unit: "件" },
        ],
        graphData: mockGraphDataWeekly,
        qas: {
          published: [
            { id: "qa1", title: "週別 Q&A 1", createdAt: "2025-03-10", views: 300 },
            { id: "qa2", title: "週別 Q&A 2", createdAt: "2025-03-12", views: 400 },
          ],
          drafts: [{ id: "qa3", title: "Draft Q&A", createdAt: "2025-03-14", views: 0 }],
          hot: [{ id: "qa2", title: "週別 Q&A 2", createdAt: "2025-03-12", views: 400 }],
        },
      };
    case "monthly":
    default:
      return {
        stats: [
          { label: "アクセス数", value: 30000, unit: "回" },
          { label: "チャット質問数", value: 1500, unit: "件" },
          { label: "公開Q&A数", value: 800, unit: "件" },
        ],
        graphData: mockGraphDataMonthly,
        qas: {
          published: [
            { id: "qa1", title: "月別 Q&A 1", createdAt: "2025-02-15", views: 500 },
            { id: "qa2", title: "月別 Q&A 2", createdAt: "2025-02-20", views: 650 },
          ],
          drafts: [{ id: "qa3", title: "Draft Q&A", createdAt: "2025-02-25", views: 0 }],
          hot: [{ id: "qa2", title: "月別 Q&A 2", createdAt: "2025-02-20", views: 650 }],
        },
      };
  }
};


const DashboardPage: React.FC = () => {
  const router = useRouter();
 
  const [filter, setFilter] = useState<{ period: string }>({
    period: "monthly",
  });

  const handleFilterChange = (newFilter: { period: string }) => {
    setFilter(newFilter);
  };
  
  const handleQACardClick = (qaId: string) => {
    router.push(`/corporate/qa/${qaId}`);
  };

  // バックエンド接続なしのため、モックデータを使用
  const dashboardData: DashboardData = getMockDashboardData(filter.period);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          menuItems={[
            { label: "ダッシュボード", link: "/corporate/dashboard" },
            { label: "Q&A管理", link: "/corporate/qa" },
            { label: "IRチャット", link: "/corporate/irchat" },
            { label: "設定", link: "/corporate/settings" },
          ]}
          isCollapsible
          selectedItem="/corporate/dashboard"
          onSelectMenuItem={(link) => router.push(link)}
        />
        <main className="flex-1 p-6 bg-gray-50">
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
        </main>
      </div>
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

