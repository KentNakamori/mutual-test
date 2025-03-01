/**
 * SearchFilterBarコンポーネント
 * - SearchBar + FilterBar をひとまとめにし、検索キーワード & フィルタを同時に扱う複合UI
 */

import React, { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import FilterBar, { FilterBarProps } from "@/components/ui/FilterBar";

type SearchFilterBarProps = {
  /** SearchBarのプレースホルダ */
  searchPlaceholder?: string;
  /** 初期キーワード値 */
  defaultKeyword?: string;
  /** 検索実行ハンドラ (キーワードとフィルタ条件を渡す) */
  onSearch: (payload: {
    keyword: string;
    filters: FilterBarProps["filters"];
  }) => void;

  /** フィルタ定義 (FilterBarにそのまま渡す) */
  filters: FilterBarProps["filters"];

  /** フィルタをリセット(全部クリア)などしたときのハンドラ */
  onReset?: () => void;
};

/**
 * SearchFilterBar
 */
const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchPlaceholder = "キーワードを入力",
  defaultKeyword = "",
  onSearch,
  filters,
  onReset,
}) => {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [currentFilters, setCurrentFilters] = useState(filters);

  // フィルタが変わったとき
  const handleFilterChange = (updated: FilterBarProps["filters"]) => {
    setCurrentFilters(updated);
  };

  // 検索ボタン or Enter押下時
  const handleSearch = (k: string) => {
    onSearch({
      keyword: k,
      filters: currentFilters,
    });
  };

  // リセット: キーワード + フィルタを全てクリア
  const handleReset = () => {
    setKeyword("");
    setCurrentFilters(
      currentFilters.map((f) => ({ ...f, value: f.type === "checkbox" ? false : "" }))
    );
    if (onReset) onReset();
  };

  return (
    <div className="space-y-4">
      {/* 検索バー (キーワード) */}
      <SearchBar
        defaultValue={keyword}
        placeholder={searchPlaceholder}
        onSearch={(kw) => handleSearch(kw)}
        buttonLabel="Search"
      />

      {/* フィルタバー */}
      <FilterBar
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
    </div>
  );
};

export default SearchFilterBar;
