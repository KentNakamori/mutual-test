// src/components/features/investor/company/InvestorChatSidebar.tsx
"use client";

import React, { useState } from 'react';
import { Search, ChevronDown, Plus, MessageSquare, FileText, Bell, User } from 'lucide-react';
import { ChatSession } from '@/types';

interface InvestorChatSidebarProps {
  sessions: ChatSession[];
  selectedSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

const InvestorChatSidebar: React.FC<InvestorChatSidebarProps> = ({
  sessions,
  selectedSessionId,
  onSelectSession,
  onNewChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 上部：ツール部分（新規チャットボタンとツール一覧）　パディング・文字サイズを縮小
  const toolsSection = (
    <div className="flex-shrink-0">
      {/* チャット検索 */}
      <div className="p-2">
        <div className="relative mb-2">
          <div className="absolute inset-y-0 left-2 pl-1 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="チャット検索"
            className="w-full pl-8 pr-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* 新規チャットボタン */}
      <div className="p-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <Plus size={14} className="mr-1" />
          新規チャット
        </button>
      </div>
      
      {/* ツール一覧 */}
      <div className="p-2 border-b">
        <div className="font-medium text-gray-500 mb-1">ツール</div>
        <ul className="space-y-1">
          {[
            { id: 'email', name: 'メール作成', icon: <FileText size={14} /> },
          ].map(tool => (
            <li
              key={tool.id}
              className="flex items-center w-full px-2 py-1 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <span className="mr-1">{tool.icon}</span>
              <span>{tool.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // 下部：チャット履歴部分（独立スクロール）
  const chatHistorySection = (
    <div className="flex-1 overflow-y-auto p-2">
      <div className="font-medium text-gray-500 mb-1">チャット履歴</div>
      <ul className="space-y-1">
        {sessions
          .filter(session => session.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((session) => (
            <li
              key={session.sessionId}
              onClick={() => onSelectSession(session.sessionId)}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedSessionId === session.sessionId ? 'bg-gray-200 font-semibold' : ''
              }`}
            >
              <div className="flex items-center">
                <MessageSquare size={14} className={`mr-1 ${selectedSessionId === session.sessionId ? 'text-blue-600' : 'text-gray-500'}`} />
                <div className="flex-1 truncate">
                  <div className="font-medium">{session.lastMessageSnippet}</div>
                  <div className="text-gray-500">
                    {new Date(session.lastMessageTimestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {toolsSection}
      {chatHistorySection}
    </div>
  );
};

export default InvestorChatSidebar;
