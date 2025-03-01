"use client";

import React from "react";
import ChatLogListItem from "./ChatLogListItem";

interface ChatLogListProps {
  logs: {
    sessionId: string;
    title?: string;
    companyId?: string;
    updatedAt: string;
  }[];
  onClickItem: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onArchive?: (sessionId: string) => void; // 必要なら
}

/**
 * ChatLogList
 * - 受け取ったlogsをリスト形式で表示
 */
const ChatLogList: React.FC<ChatLogListProps> = ({
  logs,
  onClickItem,
  onDelete,
  onArchive,
}) => {
  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <ChatLogListItem
          key={log.sessionId}
          log={log}
          onClick={() => onClickItem(log.sessionId)}
          onDelete={() => onDelete(log.sessionId)}
          onArchive={onArchive ? () => onArchive(log.sessionId) : undefined}
        />
      ))}
    </div>
  );
};

export default ChatLogList;
