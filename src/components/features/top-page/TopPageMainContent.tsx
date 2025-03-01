/**
 * @file TopPageMainContent.tsx
 * @description トップページ固有のメインコンテンツ。
 *
 * 検索バー・フィルタ・企業一覧・最近のチャット一覧など、トップページ特有の要素をまとめる。
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth"; // 認証Contextを利用する例
import { Company } from "@/types/domain";
import CompanyListSection from "./CompanyListSection";
import RecentChatListSection from "./RecentChatListSection";
import SearchFilterBar from "@/components/ui/SearchFilterBar"; // 例: 共通化された検索+フィルタバー
import { FilterBarProps } from "@/types/components"; // フィルタ項目の型
import { useCompanies } from "@/hooks/useCompanies";

const mockCompanies: Company[] = [
  {
    id: "mock-company-1",
    name: "Mock Company 1",
    industry: "IT",
    logoUrl: "",
    description: "オフライン用モック企業データ1",
    followerCount: 123,
    createdAt: "2025-02-25T00:00:00Z",
    updatedAt: "2025-02-27T00:00:00Z",
  },
  {
    id: "mock-company-2",
    name: "Mock Company 2",
    industry: "Finance",
    logoUrl: "",
    description: "オフライン用モック企業データ2",
    followerCount: 456,
    createdAt: "2025-02-25T00:00:00Z",
    updatedAt: "2025-02-27T00:00:00Z",
  },
];

export default function TopPageMainContent() {
  const { isAuthenticated, user } = useAuth();

  // 検索フィルタ管理（ローカルステート）
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<FilterBarProps["filters"]>([
    {
      key: "industry",
      label: "業種",
      type: "select",
      options: ["IT", "Finance", "Retail"],
      value: "",
    },
    {
      key: "followed",
      label: "フォロー中のみ",
      type: "checkbox",
      value: false,
    },
  ]);

  // APIパラメータの組み立て
  const industryFilterValue = filters.find((f) => f.key === "industry")?.value || "";
  const followedFilterValue = filters.find((f) => f.key === "followed")?.value || false;

  // useCompaniesフックを使って企業一覧を取得
  const {
    data: companiesData,
    isLoading,
    isError,
    error,
  } = useCompanies({
    q: keyword,
    industry: typeof industryFilterValue === "string" ? industryFilterValue : "",
    followedOnly: followedFilterValue === true,
    page: 1,
    limit: 10,
  });

  // 万が一APIが失敗したときに使うモック
  const [fallbackData, setFallbackData] = useState<Company[]>([]);

  // APIエラーの場合にモックへフォールバック
  useEffect(() => {
    if (isError && error) {
      console.warn("Fetching companies failed, fallback to mock data:", error);
      setFallbackData(mockCompanies);
    }
  }, [isError, error]);

  

  // 検索ボタンやEnter押下時
  const handleSearch = (payload: { keyword: string; filters: FilterBarProps["filters"] }) => {
    setKeyword(payload.keyword);
    setFilters(payload.filters);
  };

  // リセットボタン押下時
  const handleReset = () => {
    setKeyword("");
  };

  // 取得した企業リストをUIに渡す
  const companies = companiesData?.data || fallbackData;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* ページタイトル */}
      <h1 className="text-2xl font-semibold leading-relaxed text-black mb-6">
        トップページ
      </h1>

      {/* 検索＋フィルタバー */}
      <SearchFilterBar
        searchPlaceholder="企業名で検索"
        defaultKeyword={keyword}
        onSearch={handleSearch}
        onReset={handleReset}
        filters={filters}
      />

      {/* 企業一覧セクション */}
      <section className="mt-8">
        <CompanyListSection
          companies={companies}
          isLoading={isLoading}
          errorMessage={isError ? "企業一覧の取得に失敗しました" : ""}
        />
      </section>

      {/* ログイン時のみ「最近のチャット一覧」を表示する例 */}
      {isAuthenticated && (
        <section className="mt-12">
          <RecentChatListSection userName={user?.name || "ゲスト"} />
        </section>
      )}
    </div>
  );
}
