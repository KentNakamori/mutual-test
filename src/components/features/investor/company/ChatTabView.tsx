// src/components/features/investor/company/InvestorChatSidebar.tsx
"use client";

import React, { useState } from 'react';
import { Search, ChevronDown, Plus, MessageSquare, FileText, Bell, User, HelpCircle } from 'lucide-react';
import { ChatSession, InvestorChatSidebarProps} from '@/types';

<<<<<<< HEAD

const InvestorChatSidebar: React.FC<InvestorChatSidebarProps> = ({
  sessions,
  selectedSessionId,
  onSelectSession,
  onNewChat,
  onSendQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ 質問のリスト
  const faqQuestions = [
    '業績見通しをおしえてください',
    '海外展開についておしえてください',
    '株主還元方針についておしえてください',
    '新製品の開発状況をおしえてください',
    'ESG活動についておしえてください',
  ];

  // 質問クリック時の処理
  const handleQuestionClick = (question: string) => {
    onSendQuestion(question);
=======
const ChatTabView: React.FC<ChatTabViewProps> = ({ companyId }) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { sessionId: '1', title: '案件A', lastMessageTimestamp: new Date().toISOString() },
    { sessionId: '2', title: '案件B', lastMessageTimestamp: new Date().toISOString() },
    { sessionId: '3', title: '案件C', lastMessageTimestamp: new Date().toISOString() },
  ]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(chatSessions[0]?.sessionId || '');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { messageId: "1", sender: "ai", text: "こんにちは。どのようなご質問でしょうか？", timestamp: new Date().toISOString() },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    // セッション切替時の追加処理があれば記述
  };
  
  const handleNewChat = () => {
    const now = new Date();
    const newSession = {
      sessionId: now.getTime().toString(),
      title: `新規チャット (${now.toLocaleDateString()} ${now.toLocaleTimeString()})`,
      lastMessageTimestamp: now.toISOString(),
    };
    setChatSessions(prev => [newSession, ...prev]);
    setSelectedSessionId(newSession.sessionId);
    setMessages([]);  // 新規チャットではメッセージクリア
  };
  
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      sender: "user",
      text: message,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          messageId: (Date.now() + 1).toString(),
          sender: "ai",
          text: "これはAIからの回答です。",
          timestamp: new Date().toISOString(),
        }
      ]);
      setLoading(false);
    }, 1000);
>>>>>>> 86f5af3c6cf49af36604d0520dee8c873013c641
  };

  // ※ ツール一覧部分をFAQセクションに置き換え
  const faqSection = (
    <div className="p-3 border-b">
      <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
        <HelpCircle size={16} className="mr-1.5 text-blue-500" />
        よくある質問
      </h3>
      <div className="space-y-1.5">
        {faqQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuestionClick(question)}
            className="w-full flex items-start text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
          >
            <MessageSquare size={14} className="mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>{question}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // 下部：チャット検索とチャット履歴部分
  const chatHistorySection = (
    <div className="flex-1 overflow-y-auto p-2">
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-2 pl-1 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="チャット検索"
          className="w-full pl-8 pr-3 py-1 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
<<<<<<< HEAD
      <div className="text-xs font-medium text-gray-500 mb-1">チャット履歴</div>
      <ul className="space-y-1">
        {sessions
          .filter((session) => session.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((session) => (
            <li
              key={session.sessionId}
              onClick={() => onSelectSession(session.sessionId)}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors text-xs ${
                selectedSessionId === session.sessionId ? 'bg-gray-200 font-semibold' : ''
              }`}
            >
              <div className="flex items-center">
                <MessageSquare
                  size={14}
                  className={`mr-1 ${
                    selectedSessionId === session.sessionId ? 'text-blue-600' : 'text-gray-500'
                  }`}
                />
                <div className="flex-1 truncate">
                  <div className="font-medium">{session.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(session.lastMessageTimestamp).toLocaleString()}
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
      {/* 上部: FAQセクション */}
      {faqSection}
      {/* 下部: チャット検索＋チャット履歴 */}
      {chatHistorySection}
=======
      {/* 右側チャットエリア） */}
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {/* 上部（チャットメッセージエリア）：スクロール対象 */}
        <div className="flex-1 overflow-y-auto">
          <ChatMessages
            messages={messages}
          />
        </div>
        {/* 下部（固定の入力欄） */}
        <div className="flex-shrink-0">
          <ChatInputBox onSendMessage={handleSendMessage} />
        </div>
      </div>
>>>>>>> 86f5af3c6cf49af36604d0520dee8c873013c641
    </div>
  );
};

export default InvestorChatSidebar;
