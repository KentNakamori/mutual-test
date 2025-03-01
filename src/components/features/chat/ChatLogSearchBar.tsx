"use client";

import React from "react";
import { Input } from "@/components/ui/shadcn/input"; // shadcn Input
import { Button } from "@/components/ui/Button";       // shadcn Button
import { Switch } from "@/components/ui/shadcn/switch"; // shadcn Switch

interface ChatLogSearchBarProps {
  keyword: string;
  showArchived?: boolean;
  onChangeKeyword: (val: string) => void;
  onToggleArchived: (checked: boolean) => void;
  onSearch: () => void;
}

/**
 * ChatLogSearchBar
 * - 検索キーワードとアーカイブ表示切り替えスイッチ、検索ボタン
 */
const ChatLogSearchBar: React.FC<ChatLogSearchBarProps> = ({
  keyword,
  showArchived = false,
  onChangeKeyword,
  onToggleArchived,
  onSearch,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeKeyword(e.target.value);
  };

  return (
    <div className="w-full mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
      {/* キーワード入力 */}
      <div className="flex-1">
        <Input
          value={keyword}
          onChange={handleInputChange}
          placeholder="検索キーワード"
        />
      </div>

      {/* アーカイブ表示トグル */}
      <label className="flex items-center space-x-2 text-sm text-gray-700">
        <Switch
          checked={showArchived}
          onCheckedChange={onToggleArchived}
        />
        <span>アーカイブ含む</span>
      </label>

      {/* 検索ボタン */}
      <Button variant="outline" onClick={onSearch}>
        検索
      </Button>
    </div>
  );
};

export default ChatLogSearchBar;
