// src/components/features/investor/company/InvestorChatSidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Logs, HelpCircle } from 'lucide-react';
import { ChatSession } from '@/types';

interface InvestorChatSidebarProps {
  sessions: ChatSession[];
  selectedSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onQuestionSelect?: (question: string) => void;
}

const InvestorChatSidebar: React.FC<InvestorChatSidebarProps> = ({
  sessions,
  selectedSessionId,
  onSelectSession,
  onNewChat,
  onQuestionSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // FAQ質問リスト
  const faqQuestions = [
    '業績見通しをおしえてください',
    '海外展開についておしえてください',
    '株主還元方針についておしえてください',
    '新製品の開発状況をおしえてください',
    'ESG活動についておしえてください'
  ];
  
  // 質問をクリックした時の処理
  const handleQuestionClick = (question: string) => {
    if (onQuestionSelect) {
      onQuestionSelect(question);
    }
  };
  
  useEffect(() => {
    console.log('表示するセッション:', sessions);
    // セッションIDの検証
    const invalidSessions = sessions.filter(session => !session.sessionId || !session.lastMessageSnippet);
    if (invalidSessions.length > 0) {
      console.log('無効なセッション（除外済み）:', invalidSessions);
    }
  }, [sessions]);

  return (
    <div className="h-full flex flex-col bg-gray-50 min-h-0">
      {/* 上部固定セクション */}
      <div className="flex-shrink-0 bg-gray-50">
        {/* チャット検索 */}
        <div className="p-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-2 pl-1 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="チャット検索"
              className="w-full pl-8 pr-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        
        {/* 新規チャットボタン */}
        <div className="px-2 pb-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
          >
            <Plus size={16} className="mr-1" />
            新規チャット
          </button>
        </div>
        
        {/* よくある質問 */}
        <div className="px-2 pb-2 border-b border-gray-200">
          <div className="font-medium text-gray-500 mb-1 text-sm">よくある質問</div>
          <ul className="space-y-1">
            {faqQuestions.map((question, index) => (
              <li
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="flex items-start w-full px-2 py-1 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <HelpCircle size={14} className="mr-1 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{question}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 下部スクロール可能セクション */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-2">
          <div className="font-medium text-gray-500 mb-1 text-sm">チャット履歴</div>
          <ul className="space-y-1">
            {sessions
              .filter(session => {
                if (!session.sessionId) {
                  console.warn('セッションIDが存在しないセッションを除外:', session);
                  return false;
                }
                if (!session.lastMessageSnippet) {
                  console.warn('lastMessageSnippetが存在しないセッションを除外:', session);
                  return false;
                }
                return session.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase());
              })
              .map((session) => {
                if (!session.sessionId) {
                  console.error('無効なセッションID:', session);
                  return null;
                }
                return (
                  <li
                    key={session.sessionId}
                    onClick={() => onSelectSession(session.sessionId)}
                    className={`p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
                      selectedSessionId === session.sessionId ? 'bg-gray-200 font-semibold' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <Logs size={14} className={`mr-1 ${selectedSessionId === session.sessionId ? 'text-blue-600' : 'text-gray-500'}`} />
                      <div className="flex-1 truncate">
                        <div className="text-sm">{session.lastMessageSnippet || '新規チャット'}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(session.lastMessageTimestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvestorChatSidebar;
