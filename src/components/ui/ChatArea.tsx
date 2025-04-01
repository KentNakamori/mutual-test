// src/components/ui/ChatArea.tsx
import React from 'react';
import ChatInputArea from '@/components/features/corporate/irchat/ChatInputArea';
import MessageList from '@/components/features/corporate/irchat/MessageList';

export interface ChatMessage {
  messageId: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  chatTitle: string;  // 新規追加
}

/**
 * ChatArea コンポーネント
 * チャット表題、メッセージ一覧、入力エリアを表示します。
 * 各部分は独立スクロールするように設定されています。
 */
const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, chatTitle }) => {
  return (
    <div className="flex flex-col h-full">
      {/* チャット表題部分 */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">{chatTitle}</h2>
      </div>
      {/* メッセージ一覧（独立スクロール） */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
      </div>
      {/* チャット入力エリア */}
      <div className="p-4 border-t">
        <ChatInputArea onSend={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;
