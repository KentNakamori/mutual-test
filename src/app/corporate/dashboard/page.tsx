// src/app/corporate/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useGuestToken } from "@/hooks/useGuestToken";
import { getCorporateDashboard } from "@/libs/api";
import { LayoutDashboard, HelpCircle, MessageSquare, Settings } from 'lucide-react';
import { DashboardData, Filter, Period } from "@/types";

// 共通コンポーネントのインポート
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";

// ダッシュボード固有コンポーネントのインポート
import DashboardStats from "@/components/features/corporate/dashboard/DashboardStats";
import FilterBar from "@/components/features/corporate/dashboard/FilterBar";
import DashboardGraphs from "@/components/features/corporate/dashboard/DashboardGraphs";
import DashboardQnAList from "@/components/features/corporate/dashboard/DashboardQnAList";



const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const [filter, setFilter] = useState<Filter>({
    period: "monthly",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError("認証トークンがありません");
        return;
      }

      try {
        setIsLoading(true);
        const data = await getCorporateDashboard(token, { period: filter.period });
        
        // APIから返されるデータをそのまま使用
        const transformedData = {
          ...data,
          graphData: {
            ...data.graphData,
            [filter.period]: data.graphData[filter.period].map(item => ({
              ...item,
              date: item.date
            }))
          }
        };

        // console.log("変換後のデータ:", transformedData);
        setDashboardData(transformedData);
        setError(null);
      } catch (error) {
        // console.error("ダッシュボードデータの取得に失敗しました:", error);
        setError("ダッシュボードデータの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, filter.period]);

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
    // console.log("フィルター変更:", newFilter);
  };

  const handleQACardClick = (qaId: string) => {
    // console.log("選択されたQA:", qaId);
    router.push(`/corporate/qa/${qaId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error || "データの取得に失敗しました"}</div>
      </div>
    );
  }

  // console.log("現在の期間:", filter.period);
  // console.log("表示中の統計データ:", dashboardData.stats[filter.period]);
  // console.log("表示中のグラフデータ:", dashboardData.graphData[filter.period]);
  console.log("公開済みQ&A:", dashboardData.qas.published);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          menuItems={[
            { label: "ダッシュボード", link: "/corporate/dashboard", icon: <LayoutDashboard size={20} />},
            { label: "Q&A管理", link: "/corporate/qa", icon: <HelpCircle size={20} /> },
            { label: "IRチャット", link: "/corporate/irchat" , icon: <MessageSquare size={20} />},
            { label: "設定", link: "/corporate/settings", icon: <Settings size={20} />  },
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
