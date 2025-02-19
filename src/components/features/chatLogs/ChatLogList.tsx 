"use client";

import React from "react";
import { ChatLogListProps } from "@/types/components";

export default function ChatLogList({
  logs,
  onClickItem,
  onDelete,
  onArchive,
}: ChatLogListProps) {
  if (!logs.length) {
    return <p className="text-sm text-gray-500">チャットログはありません。</p>;
  }

  return (
    <ul className="space-y-2">
      {logs.map((log) => (
        <li
          key={log.sessionId}
          className="border border-gray-200 p-4 rounded flex items-center justify-between hover:bg-gray-50"
        >
          {/* 左側：タイトル等 */}
          <div
            onClick={() => onClickItem(log.sessionId)}
            className="cursor-pointer flex-1"
          >
            <h2 className="font-medium text-gray-800">
              {log.title || "無題のチャット"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              更新: {log.updatedAt}
            </p>
          </div>

          {/* 右側：操作ボタン */}
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onArchive(log.sessionId)}
              className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              アーカイブ
            </button>
            <button
              onClick={() => onDelete(log.sessionId)}
              className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              削除
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
