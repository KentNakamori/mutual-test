"use client";

import React from "react";
import { ChatSessionListProps } from "@/types/components";

/**
 * 過去セッション一覧
 * - セッション履歴をリスト表示
 */
const ChatSessionList: React.FC<ChatSessionListProps> = ({
  sessions,
  onSelectSession,
}) => {
  return (
    <div className="space-y-2">
      {sessions.length === 0 && (
        <p className="text-sm text-gray-500">セッション履歴がありません</p>
      )}
      {sessions.map((session) => (
        <div
          key={session.sessionId}
          className="p-2 cursor-pointer hover:bg-gray-100 rounded transition-colors duration-200"
          onClick={() => onSelectSession(session.sessionId)}
        >
          <h3 className="text-sm font-semibold">
            {session.title || "無題のチャット"}
          </h3>
          <p className="text-xs text-gray-500">更新: {session.lastUpdated}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatSessionList;
