// src/components/features/investor/company/InvestorChatSidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, HelpCircle } from 'lucide-react';
import { ChatSession } from '@/types';

interface InvestorChatSidebarProps {
  sessions: ChatSession[];
  selectedSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onSendQuestion?: (question: string) => void;
}

const InvestorChatSidebar: React.FC<InvestorChatSidebarProps> = ({
  sessions,
  selectedSessionId,
  onSelectSession,
  onNewChat,
  onSendQuestion,
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
    if (onSendQuestion) {
      // セッションが選択されていない場合は先に新規チャットを作成
      if (!selectedSessionId) {
        console.log('FAQ質問: 新規チャット作成後に質問送信:', question);
        onNewChat(); // 新規チャットを作成
        // 新規チャット作成後、質問を送信
        // 新規チャット作成は同期的に完了するため、すぐに質問を送信可能
        onSendQuestion(question);
      } else {
        console.log('FAQ質問: 既存セッションに質問送信:', question);
        // 既存セッションが選択されている場合はそのまま送信
        onSendQuestion(question);
      }
    }
  };
  
  useEffect(() => {
    console.log('表示するセッション:', sessions);
    // セッションIDの検証
    const invalidSessions = sessions.filter(session => !session.sessionId || !session.lastMessageSnippet);
    if (invalidSessions.length > 0) {
      console.error('無効なセッション:', invalidSessions);
    }
  }, [sessions]);

  // 上部：チャット検索とFAQ
  const topSection = (
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
      <div className="p-2 pb-1">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <MessageSquare size={14} className="mr-1" />
          新規チャット
        </button>
      </div>
      
      {/* FAQ質問一覧 */}
      <div className="px-2 pb-2 border-b">
        <div className="font-medium text-gray-500 text-xs mb-1">よくある質問</div>
        <ul className="space-y-0.5">
          {faqQuestions.map((question, index) => (
            <li
              key={index}
              onClick={() => handleQuestionClick(question)}
              className="flex items-center w-full px-2 py-0.5 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <HelpCircle size={12} className="mr-1 text-blue-500 flex-shrink-0" />
              <span className="text-xs">{question}</span>
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
                  <MessageSquare size={14} className={`mr-1 ${selectedSessionId === session.sessionId ? 'text-blue-600' : 'text-gray-500'}`} />
                  <div className="flex-1 truncate">
                    <div className="font-medium">{session.lastMessageSnippet || '新規チャット'}</div>
                    <div className="text-gray-500">
                      {new Date(session.lastMessageTimestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {topSection}
      {chatHistorySection}
    </div>
  );
};

export default InvestorChatSidebar;
