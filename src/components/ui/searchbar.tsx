/**
 * SearchBarコンポーネント
 * - テキスト入力 + ボタンをまとめたシンプルな検索バー
 * - 内部的に Input, Button(shadcn) を組み合わせる例
 */

import React, { useState } from "react";
import Input from "./Input";
import { Button } from "@/components/ui/Button";

type SearchBarProps = {
  /** 初期値 */
  defaultValue?: string;
  /** 検索実行コールバック */
  onSearch: (keyword: string) => void;
  /** プレースホルダ */
  placeholder?: string;
  /** ボタンラベル */
  buttonLabel?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  defaultValue = "",
  onSearch,
  placeholder = "Search...",
  buttonLabel = "Search",
}) => {
  const [keyword, setKeyword] = useState(defaultValue);

  const handleSearch = () => {
    onSearch(keyword);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(keyword);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        variant="default"
        onClick={handleSearch}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

export default SearchBar;
