"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyDetail } from "@/libs/api";
import CompanyHeader from "@/components/features/companyPage/CompanyHeader";
import TabSwitcher from "@/components/features/companyPage/TabSwitcher";
import ChatView from "@/components/features/companyPage/ChatView";
import QAListView from "@/components/features/companyPage/QAListView";

// 企業データの型定義
interface CompanyData {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  description: string;
  isFollowing: boolean;
}

// 企業データの型定義
interface CompanyData {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  description: string;
  isFollowing: boolean;
}

// ページ本体だ
export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;

  // React Query v5の新しい構文で企業詳細データを取得
  const { data: companyData, isLoading, error } = useQuery({
    queryKey: ["companyDetail", companyId],
    queryFn: () => fetchCompanyDetail(companyId),
    enabled: !!companyId
  });

  // 選択中のタブ: "chat" or "qa"
  const [activeTab, setActiveTab] = useState<"chat" | "qa">("chat");

  // ローディング / エラー表示
  if (isLoading) return <div>Loading company info...</div>;
  if (error) return <div className="text-error">Error loading company data.</div>;
  if (!companyData) return <div className="text-error">No company data found.</div>;

  // コンパイラに型を伝えるため、as CompanyDataを使用
  const company = companyData as CompanyData;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 企業情報ヘッダー */}
      <CompanyHeader
        companyName={company.name}
        logoUrl={company.logoUrl}
        industry={company.industry}
        description={company.description}
        isFollowing={company.isFollowing}
        companyId={company.id}
      />

      {/* タブ切り替え */}
      <div className="border-b border-gray-200">
        <TabSwitcher
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab as "chat" | "qa")}
        />
      </div>

      <main className="flex-grow p-4">
        {activeTab === "chat" && (
          <ChatView companyId={company.id} />
        )}
        {activeTab === "qa" && (
          <QAListView companyId={company.id} />
        )}
      </main>
    </div>
  );
}