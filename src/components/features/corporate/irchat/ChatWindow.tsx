// src/components/features/corporate/irchat/ChatWindow.tsx
import React from 'react';
import MessageList from './MessageList';
import ChatInputArea from './ChatInputArea';
import DraftActionBar from './DraftActionBar';

interface ChatMessage {
  messageId: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onRegisterQA: () => void;
  onCreateMailDraft: () => void;
}

/**
 * ChatWindow コンポーネント
 * チャットメッセージの一覧と入力エリア、下部アクションボタンを表示します。
 */
const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, onRegisterQA, onCreateMailDraft }) => {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4">
        <MessageList messages={messages} />
      </div>
      <ChatInputArea onSend={onSendMessage} />
      <DraftActionBar onRegisterQA={onRegisterQA} onCreateMailDraft={onCreateMailDraft} />
    </div>
  );
};

export default ChatWindow;
