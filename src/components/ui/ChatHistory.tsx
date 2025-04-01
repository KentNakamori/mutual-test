// src/components/ui/ChatHistory.tsx
import React, { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';

export interface ChatSession {
  sessionId: string;
  title: string;
  lastMessageTimestamp: string;
}

export interface ChatHistoryProps {
  sessions: ChatSession[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  selectedSessionId,
  onSelectSession,
  onNewChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // フィルター：セッションタイトルに検索クエリが含まれるものを抽出
  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* 検索バーと新規チャット追加ボタン */}
      <div className="flex items-center p-4 border-b">
        <div className="flex items-center bg-gray-100 rounded w-full">
          <FaSearch className="ml-2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="検索..."
            className="w-full p-2 bg-transparent focus:outline-none"
          />
        </div>
        <button onClick={onNewChat} className="ml-2 p-2 rounded-full hover:bg-gray-200">
          <FaPlus size={16} />
        </button>
      </div>
      {/* セッション一覧：独立スクロール */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {filteredSessions.map((session) => (
            <li
              key={session.sessionId}
              onClick={() => onSelectSession(session.sessionId)}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                selectedSessionId === session.sessionId ? 'bg-gray-200 font-semibold' : ''
              }`}
            >
              <div>{session.title}</div>
              <div className="text-xs text-gray-500">
                {new Date(session.lastMessageTimestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatHistory;
