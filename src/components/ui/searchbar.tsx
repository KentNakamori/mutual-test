/**
 * @file components/ui/SearchBar.tsx
 * @description 検索キーワード入力や検索ボタンをまとめたUI
 */

import React from "react";
import {Input} from "./input";
import {Button}from "./button";

type SearchBarProps = {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  onClear?: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "キーワードを入力",
  value,
  onChange,
  onSearch,
  onClear,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      {onClear && value && (
        <Button variant="ghost" label="クリア" onClick={onClear} />
      )}
      <Button label="検索" onClick={onSearch} />
    </div>
  );
};

export default SearchBar;
