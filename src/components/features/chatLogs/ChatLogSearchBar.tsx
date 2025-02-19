"use client";

import React from "react";
import { ChatLogSearchBarProps } from "@/types/components";

export default function ChatLogSearchBar({
  keyword,
  showArchived,
  onChangeKeyword,
  onToggleArchived,
  onSearch,
}: ChatLogSearchBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      {/* キーワード入力 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1"
          placeholder="チャットタイトルで検索"
          value={keyword}
          onChange={(e) => onChangeKeyword(e.target.value)}
        />
        <button
          onClick={onSearch}
          className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors"
        >
          検索
        </button>
      </div>

      {/* アーカイブ切り替え */}
      <label className="flex items-center text-sm text-gray-700 cursor-pointer mt-2 sm:mt-0 sm:ml-4">
        <input
          type="checkbox"
          className="mr-1"
          checked={showArchived}
          onChange={(e) => onToggleArchived(e.target.checked)}
        />
        アーカイブも表示
      </label>
    </div>
  );
}
