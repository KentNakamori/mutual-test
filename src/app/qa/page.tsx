"use client";

import React, { useState } from "react";
import { useQASearch } from "@/hooks/useQA"; // React Queryフックで検索APIを呼ぶイメージ
import InvestorQASearchLayout from "@/components/features/investorQA/InvestorQASearchLayout";

export default function InvestorQASearchPage() {
  // 検索条件をローカルステートで保持
  const [keyword, setKeyword] = useState("");
  const [company, setCompany] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  // React Query で検索API呼び出し
  const { data, isLoading, error } = useQASearch({
    keyword,
    company,
    sort,
    page,
    limit: 10,
  });

  // 検索実行ハンドラ
  const handleSearch = (conditions: {
    keyword?: string;
    company?: string;
    sort?: string;
  }) => {
    setKeyword(conditions.keyword || "");
    setCompany(conditions.company || "");
    setSort(conditions.sort || "");
    setPage(1); // 検索条件変更時は1ページ目に
  };

  // ページ遷移ハンドラ
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // レンダリング
  return (
    <div className="min-h-screen flex flex-col">
      {/* HeaderやSidebar、Footerなどは共通レイアウトに含まれる想定 */}
      <main className="flex-grow">
        <InvestorQASearchLayout
          keyword={keyword}
          selectedCompany={company}
          sort={sort}
          page={page}
          data={data?.data || []}
          totalCount={data?.totalCount || 0}
          isLoading={isLoading}
          errorMessage={error ? (error as Error).message : undefined}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}
