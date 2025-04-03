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

import { GraphDataItem, DashboardData, Filter, Period  } from "@/types"


// 新しいAPI出力に合わせたモックデータ
const getMockDashboardData = (period: Period): DashboardData => {
  return {
    stats: {
      daily: [
        { label: "アクセス数", value: 0, unit: "回" },
        { label: "チャット質問数", value: 2, unit: "件" },
        { label: "公開Q&A数", value: 4, unit: "件" },
      ],
      weekly: [
        { label: "アクセス数", value: 0, unit: "回" },
        { label: "チャット質問数", value: 5, unit: "件" },
        { label: "公開Q&A数", value: 9, unit: "件" },
      ],
      monthly: [
        { label: "アクセス数", value: 0, unit: "回" },
        { label: "チャット質問数", value: 6, unit: "件" },
        { label: "公開Q&A数", value: 10, unit: "件" },
      ],
    },
    graphData: {
      daily: [
        { date: "2025-03-27", access: 0, chatCount: 1 },
        { date: "2025-03-30", access: 0, chatCount: 1 },
      ],
      weekly: [
        { date: "2025-10", access: 0, chatCount: 1 },
        { date: "2025-11", access: 0, chatCount: 2 },
        { date: "2025-12", access: 0, chatCount: 1 },
        { date: "2025-13", access: 0, chatCount: 1 },
      ],
      monthly: [
        { date: "2025-03", access: 0, chatCount: 6 },
      ],
    },
    qas: {
      published: [
        {
          qaId: "67ee2e69f0a6b85c7d42fbf1",
          title: "QAタイトル 10",
          question: "質問文 10 for company 67ee2e68f0a6b85c7d42fbdf",
          answer: "回答文 10 for company 67ee2e68f0a6b85c7d42fbdf",
          companyId: "67ee2e68f0a6b85c7d42fbdf",
          likeCount: 0,
          tags: ["tag2"],
          genre: ["genre2"],
          fiscalPeriod: "2025-Q4",
          createdAt: "2025-03-11T19:17:33.636000",
          updatedAt: "2025-04-02T00:33:58.636000",
          isPublished: true,
        },
        {
          qaId: "67ee2e69f0a6b85c7d42fbf0",
          title: "QAタイトル 9",
          question: "質問文 9 for company 67ee2e68f0a6b85c7d42fbdf",
          answer: "回答文 9 for company 67ee2e68f0a6b85c7d42fbdf",
          companyId: "67ee2e68f0a6b85c7d42fbdf",
          likeCount: 6,
          tags: ["tag2"],
          genre: ["genre3"],
          fiscalPeriod: "2025-Q1",
          createdAt: "2025-03-25T17:14:45.636000",
          updatedAt: "2025-03-25T04:00:49.636000",
          isPublished: true,
        },
        {
          qaId: "67ee2e69f0a6b85c7d42fbef",
          title: "QAタイトル 8",
          question: "質問文 8 for company 67ee2e68f0a6b85c7d42fbdf",
          answer: "回答文 8 for company 67ee2e68f0a6b85c7d42fbdf",
          companyId: "67ee2e68f0a6b85c7d42fbdf",
          likeCount: 16,
          tags: ["tag1"],
          genre: ["genre3"],
          fiscalPeriod: "2025-Q4",
          createdAt: "2025-03-31T22:11:25.636000",
          updatedAt: "2025-03-21T22:06:42.636000",
          isPublished: true,
        },
        {
          qaId: "67ee2e69f0a6b85c7d42fbec",
          title: "QAタイトル 5",
          question: "質問文 5 for company 67ee2e68f0a6b85c7d42fbdf",
          answer: "回答文 5 for company 67ee2e68f0a6b85c7d42fbdf",
          companyId: "67ee2e68f0a6b85c7d42fbdf",
          likeCount: 13,
          tags: ["tag3"],
          genre: ["genre1"],
          fiscalPeriod: "2025-Q1",
          createdAt: "2025-04-01T08:47:04.636000",
          updatedAt: "2025-03-21T16:13:14.636000",
          isPublished: true,
        },
        {
          qaId: "67ee2e69f0a6b85c7d42fbeb",
          title: "QAタイトル 4",
          question: "質問文 4 for company 67ee2e68f0a6b85c7d42fbdf",
          answer: "回答文 4 for company 67ee2e68f0a6b85c7d42fbdf",
          companyId: "67ee2e68f0a6b85c7d42fbdf",
          likeCount: 18,
          tags: ["tag3"],
          genre: ["genre1"],
          fiscalPeriod: "2025-Q1",
          createdAt: "2025-03-05T12:49:28.636000",
          updatedAt: "2025-03-19T01:09:54.636000",
          isPublished: true,
        },
      ],
    },
  };
};

const DashboardPage: React.FC = () => {
  const router = useRouter();

  const [filter, setFilter] = useState<Filter>({
    period: "monthly",
  });

  // 選択された期間のデータのみを利用
  const dashboardData: DashboardData = getMockDashboardData(filter.period);

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const handleQACardClick = (qaId: string) => {
    router.push(`/corporate/qa/${qaId}`);
  };

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
          <DashboardStats statsData={dashboardData.stats[filter.period]} />
          <DashboardGraphs graphData={dashboardData.graphData[filter.period]} />
          <DashboardQnAList
            publishedQAs={dashboardData.qas.published}
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

