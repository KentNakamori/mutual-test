"use client";

import React from "react";
import { Trash2, Archive } from "lucide-react"; 
// lucide-reactアイコン例 (shadcn推奨アイコン)

interface ChatLogListItemProps {
  log: {
    sessionId: string;
    title?: string;
    companyId?: string;
    updatedAt: string;
  };
  onClick: () => void;
  onDelete: () => void;
  onArchive?: () => void;
}

/**
 * ChatLogListItem
 * - 1つのチャットログ要素を表示
 */
const ChatLogListItem: React.FC<ChatLogListItemProps> = ({
  log,
  onClick,
  onDelete,
  onArchive,
}) => {
  return (
    <div
      className="bg-white rounded-md shadow-sm p-3 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={() => onClick()}
    >
      {/* 左側: タイトル / 企業など */}
      <div>
        <div className="font-semibold text-gray-800">
          {log.title || "No Title"}
        </div>
        {log.companyId && (
          <div className="text-sm text-gray-500">
            Company: {log.companyId}
          </div>
        )}
        <div className="text-xs text-gray-400">
          Updated at: {new Date(log.updatedAt).toLocaleString()}
        </div>
      </div>

      {/* 右側: 操作ボタン (削除 / アーカイブ など) */}
      <div
        className="flex items-center space-x-2"
        onClick={(e) => e.stopPropagation()} 
        // 親のonClickが発火しないようにstopPropagation
      >
        {onArchive && (
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
            onClick={() => onArchive()}
            aria-label="archive chat"
          >
            <Archive size={16} />
          </button>
        )}

        <button
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded"
          onClick={() => onDelete()}
          aria-label="delete chat"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatLogListItem;
