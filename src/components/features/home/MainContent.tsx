"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
// 例: React Query のカスタムフック (あるいは直接 api.ts を呼び出してもOK)
import { useCompanies } from "@/hooks/useCompanies";

// 共通コンポーネント (既存想定)
import SearchBar from "@/components/ui/searchbar";
import FilterBar from "@/components/ui/filterbar";

// ページ固有コンポーネント
import CompanyList from "./CompanyList";
import RecentChatList from "./RecentChatList";

/**
 * トップページメインコンテンツ
 */
export default function MainContent() {
  // ログイン状態チェック (チャット一覧の表示有無で利用)
  const { isAuthenticated } = useAuth();

  // 検索キーワードやフィルタのローカルステート
  const [keyword, setKeyword] = useState("");
  const [industry, setIndustry] = useState<string>("");
  const [followedOnly, setFollowedOnly] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  // React Queryフックで企業一覧を取得
  // hooks/useCompanies.ts 内で fetchCompanies(...) を呼び出す設計
  const {
    data: companyData,
    isLoading: isCompaniesLoading,
    error: companiesError,
  } = useCompanies({
    q: keyword,
    industry,
    followedOnly,
    page,
    limit: 6, // 例: 1ページあたり6件
  });

  // チャットリスト用のデータ (ログイン時のみ取得する例)
  // ここでは簡単に「ダミーデータを表示」する形にしています
  const [chatList, setChatList] = useState<
    { chatId: string; title?: string; updatedAt: string }[]
  >([]);

  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // ログイン時、最近のチャット一覧を取得する例 (API実装に合わせる)
    async function fetchRecentChats() {
      setIsChatLoading(true);
      setChatError(null);
      try {
        // 例: ここで fetchChatLogs() 等を呼び出し
        // const response = await fetchChatLogs({ page: 1, limit: 5 });
        // setChatList(response.data);
        // 今回はダミーデータで代用
        setChatList([
          { chatId: "abc123", title: "最近の相談1", updatedAt: "2025-02-10" },
          { chatId: "xyz789", title: "面談予定チャット", updatedAt: "2025-02-12" },
        ]);
      } catch (err: any) {
        setChatError(err.message || "チャット取得に失敗しました");
      } finally {
        setIsChatLoading(false);
      }
    }

    fetchRecentChats();
  }, [isAuthenticated]);

  // ハンドラ群
  const handleSearch = () => {
    // 例えば検索実行時にpageを1にリセット
    setPage(1);
    // 以後は useCompanies がkeywordをキーに再取得
  };

  const handleFilterChange = (values: {
    industry?: string;
    followedOnly?: boolean;
  }) => {
    if (values.industry !== undefined) {
      setIndustry(values.industry);
    }
    if (values.followedOnly !== undefined) {
      setFollowedOnly(values.followedOnly);
    }
    // フィルタ変更時もpageを1に
    setPage(1);
  };

  // ページネーション用
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* 検索バー */}
      <div className="mb-4">
        <SearchBar
          value={keyword}
          onChange={(val) => setKeyword(val)}
          onSearch={handleSearch}
          placeholder="企業名を検索"
        />
      </div>

      {/* フィルターバー (業種, フォローのみ 等) */}
      <div className="mb-6">
        <FilterBar
          industry={industry}
          followedOnly={followedOnly}
          onChange={handleFilterChange}
        />
      </div>

      {/* 企業一覧表示 */}
      <CompanyList
        companies={companyData?.data || []}
        isLoading={isCompaniesLoading}
        errorMessage={companiesError ? companiesError.message : undefined}
      />

      {/* ページネーション例 */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page <= 1}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">Page {page}</span>
        <button
          onClick={handleNextPage}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Next
        </button>
      </div>

      {/* ログイン済みなら「最近のチャット一覧」を表示 */}
      {isAuthenticated && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold leading-relaxed mb-3">
            最近のチャット
          </h2>
          <RecentChatList
            chats={chatList}
            isLoading={isChatLoading}
            errorMessage={chatError || undefined}
          />
        </div>
      )}
    </div>
  );
}
