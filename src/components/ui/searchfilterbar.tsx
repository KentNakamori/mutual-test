/**
 * @file components/ui/SearchFilterBar.tsx
 * @description SearchBar + FilterBar をひとまとめにして、検索と複数フィルタを同時に扱う
 */

import React, { useState } from "react";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";

type FilterItem = {
  type: "select" | "checkbox" | "radio" | "input";
  label: string;
  name: string;
  options?: { label: string; value: string | number }[];
};

type SearchFilterBarProps = {
  searchPlaceholder?: string;
  filters: FilterItem[];
  onSearch: (keyword: string, filterState: Record<string, any>) => void;
  onReset?: () => void;
  layout?: "horizontal" | "vertical";
  compact?: boolean;
};

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchPlaceholder = "検索キーワード",
  filters,
  onSearch,
  onReset,
  layout = "vertical",
  compact = false,
}) => {
  const [keyword, setKeyword] = useState("");
  const [filterState, setFilterState] = useState<Record<string, any>>({});

  const handleFilterChange = (updated: Record<string, any>) => {
    setFilterState(updated);
    // 必要なら即時検索 onSearch(keyword, updated);
  };

  const handleSearchClick = () => {
    onSearch(keyword, filterState);
  };

  const handleResetAll = () => {
    setKeyword("");
    setFilterState({});
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="space-y-4">
      <SearchBar
        placeholder={searchPlaceholder}
        value={keyword}
        onChange={(val) => setKeyword(val)}
        onSearch={handleSearchClick}
        onClear={keyword ? () => setKeyword("") : undefined}
      />
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={onReset ? handleResetAll : undefined}
        layout={layout}
        compact={compact}
      />
    </div>
  );
};

export default SearchFilterBar;
