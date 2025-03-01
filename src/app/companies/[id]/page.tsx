// src/app/companies/[companyId]/page.tsx
import React from "react";
import { fetchCompanyDetail } from "@/libs/api";
import { CompanyDetailResponse } from "@/types/api";
import CompanyPageClient from "./CompanyPageClient";

/**
 * バックエンドが繋がらない/エラー時に使うモックデータ
 */
const mockCompanyDetail: CompanyDetailResponse = {
  id: "mock-company-1",
  name: "サンプル株式会社（モック）",
  industry: "IT",
  logoUrl: "https://via.placeholder.com/80?text=MockLogo",
  description: "これはモックデータです。バックエンドとの接続が失敗した場合に表示されます。",
  isFollowing: false,
};

export default async function CompanyDetailPage({
  params,
}: {
  params: { companyId: string };
}) {
  const { companyId } = params;

  let companyDetail: CompanyDetailResponse;

  // サーバーサイドで企業情報を取得
  // 失敗したらモックデータを使用
  try {
    companyDetail = await fetchCompanyDetail(companyId);
  } catch (error) {
    console.error("Failed to fetch company detail. Using mock data:", error);
    companyDetail = mockCompanyDetail;
  }

  // 企業情報を Client Component に渡す
  return (
    <CompanyPageClient
      companyDetail={companyDetail}
      // ChatやQA一覧で利用するための初期情報などを付加的に渡せる
    />
  );
}
