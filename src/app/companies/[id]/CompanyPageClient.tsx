// src/app/companies/[companyId]/CompanyPageClient.tsx
"use client";

import React, { useState } from "react";
import CompanyPageLayout from "@/components/features/companies/CompanyPageLayout";
import { CompanyDetailResponse } from "@/types/api";

/**
 * Client Component
 *
 * サーバーサイドで取得した `companyDetail` を引き継ぎ、
 * ページ全体のUIを管理する (Tab切り替えや、モーダルの開閉など)。
 */
type CompanyPageClientProps = {
  companyDetail: CompanyDetailResponse;
};

export default function CompanyPageClient({ companyDetail }: CompanyPageClientProps) {
  // タブ状態の管理 ("chat" or "qa")
  const [activeTab, setActiveTab] = useState<"chat" | "qa">("chat");

  return (
    <CompanyPageLayout
      companyDetail={companyDetail}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
}
