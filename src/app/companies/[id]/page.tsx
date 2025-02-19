"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
// 例: React Queryフック
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyDetail } from "@/libs/api";
import CompanyHeader from "@/components/features/companyPage/CompanyHeader";
import TabSwitcher from "@/components/features/companyPage/TabSwitcher";
import ChatView from "@/components/features/companyPage/ChatView";
import QAListView from "@/components/features/companyPage/QAListView";

// ページ本体だ
export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;

  // 企業詳細データを取得
  const { data: companyData, isLoading, error } = useQuery(
    ["companyDetail", companyId],
    () => fetchCompanyDetail(companyId),
    { enabled: !!companyId }
  );

  // 選択中のタブ: "chat" or "qa"
  const [activeTab, setActiveTab] = useState<"chat" | "qa">("chat");

  // ローディング / エラー表示
  if (isLoading) return <div>Loading company info...</div>;
  if (error) return <div className="text-error">Error loading company data.</div>;
  if (!companyData) return <div className="text-error">No company data found.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 企業情報ヘッダー */}
      <CompanyHeader
        companyName={companyData.name}
        logoUrl={companyData.logoUrl}
        industry={companyData.industry}
        description={companyData.description}
        isFollowing={companyData.isFollowing}
        companyId={companyData.id}
      />

      {/* タブ切り替え */}
      <div className="border-b border-gray-200">
        <TabSwitcher
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab as "chat" | "qa")} // 'chat' | 'qa'
        />
      </div>

      <main className="flex-grow p-4">
        {activeTab === "chat" && (
          <ChatView companyId={companyData.id} />
        )}
        {activeTab === "qa" && (
          <QAListView companyId={companyData.id} />
        )}
      </main>
    </div>
  );
}
