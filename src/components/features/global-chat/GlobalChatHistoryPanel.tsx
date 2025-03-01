"use client";

import React from "react";
import { ChatSession } from "@/types/domain";
import { cn } from "@/libs/utils";

/**
 * 過去のチャットセッションを一覧表示するためのProps
 */
interface GlobalChatHistoryPanelProps {
  /** セッション一覧 */
  sessions: ChatSession[];
  /** 読込中表示 */
  isLoading?: boolean;
  /** 現在選択中のセッションID */
  selectedSessionId?: string;
  /** セッションを選択したときのコールバック */
  onSelectSession: (sessionId: string) => void;
}

/**
 * 全体チャットの履歴パネル
 * - ログインユーザが過去にやりとりしたセッションを一覧表示し、選択すると読み込む
 */
const GlobalChatHistoryPanel: React.FC<GlobalChatHistoryPanelProps> = ({
  sessions,
  isLoading,
  selectedSessionId,
  onSelectSession,
}) => {
  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        履歴を読み込み中です...
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        チャット履歴はありません
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded p-4 space-y-2">
      <h2 className="text-lg font-semibold mb-2">過去のチャット</h2>
      {sessions.map((session) => {
        const isActive = session.id === selectedSessionId;
        return (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={cn(
              "w-full text-left px-2 py-2 rounded transition-colors duration-200",
              "text-sm hover:bg-gray-100",
              isActive && "bg-gray-200 font-semibold"
            )}
          >
            {session.title || `セッションID: ${session.id}`}
          </button>
        );
      })}
    </div>
  );
};

export default GlobalChatHistoryPanel;
