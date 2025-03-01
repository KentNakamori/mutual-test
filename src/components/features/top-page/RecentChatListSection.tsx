/**
 * @file RecentChatListSection.tsx
 * @description ログインユーザー向けの「最近のチャット一覧」表示（ダミー実装例）
 */

import React, { useEffect, useState } from "react";

interface RecentChatListSectionProps {
  userName: string;
}

type ChatSummary = {
  id: string;
  title: string;
  lastMessageSnippet: string;
  updatedAt: string;
};

// モックデータ
const mockChatList: ChatSummary[] = [
  {
    id: "chat-123",
    title: "IT企業との会話",
    lastMessageSnippet: "最新のメッセージサンプル...",
    updatedAt: "2025-02-25T12:00:00Z",
  },
  {
    id: "chat-456",
    title: "Finance企業とのやり取り",
    lastMessageSnippet: "最後のログ...",
    updatedAt: "2025-02-26T18:00:00Z",
  },
];

const RecentChatListSection: React.FC<RecentChatListSectionProps> = ({ userName }) => {
  const [chatList, setChatList] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(false);

  // 本来は APIコール (例: useChatLogsフック等) で取得
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // 今回はモックデータを模擬的に取得
      setChatList(mockChatList);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold leading-relaxed text-black mb-3">
        最近のチャット一覧
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        {userName} さんの直近で更新されたチャットです
      </p>

      {loading && <div className="text-gray-500">読み込み中...</div>}

      {!loading && chatList.length === 0 && (
        <div className="text-gray-500">チャット履歴がありません。</div>
      )}

      <ul className="space-y-2">
        {chatList.map((chat) => (
          <li
            key={chat.id}
            className="bg-white shadow-sm p-4 rounded transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
            onClick={() => alert(`チャット画面へ移動: ${chat.title}`)}
          >
            <div className="font-medium text-gray-800">{chat.title}</div>
            <div className="text-sm text-gray-500">{chat.lastMessageSnippet}</div>
            <div className="text-xs text-gray-400 mt-1">
              最終更新: {new Date(chat.updatedAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentChatListSection;
