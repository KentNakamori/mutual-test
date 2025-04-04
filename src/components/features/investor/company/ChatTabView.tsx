//src\components\features\investor\company\ChatTabView.tsx

import React, { useState } from 'react';
import FAQPanel from './FAQPanel';
import ChatHistory from './ChatHistory';
import ChatInputBox from './ChatInputBox';
import { ChatMessage, ChatTabViewProps } from '../../../../types';


/**
 * ChatTabView コンポーネント
 * FAQパネル、チャット履歴、入力欄をまとめて表示します。
 */
const ChatTabView: React.FC<ChatTabViewProps> = ({ companyId }) => {
  // モックのチャット履歴（初期メッセージ）
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      messageId: "1",
      sender: "ai",
      text: "こんにちは。どのようなご質問でしょうか？",
      timestamp: new Date().toISOString(),
    }
  ]);
  
  const [loading, setLoading] = useState<boolean>(false);
  
  // ユーザー送信時の処理
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      messageId: Date.now().toString(),
      sender: "user",
      text: message,
      timestamp: new Date().toISOString(),
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    // AIからの回答をシミュレート
    setLoading(true);
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        messageId: (Date.now() + 1).toString(),
        sender: "ai",
        text: "これはAIからの回答です。",
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
  };
  
  // FAQ選択時、質問文をそのまま送信（もしくは入力欄に反映）
  const handleSelectFAQ = (faqText: string) => {
    handleSendMessage(faqText);
  };
  
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div className="w-full md:w-1/3">
        <FAQPanel onSelectFAQ={handleSelectFAQ} />
      </div>
      <div className="w-full md:w-2/3 flex flex-col">
        <ChatHistory messages={chatMessages} loading={loading} />
        <ChatInputBox onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatTabView;
