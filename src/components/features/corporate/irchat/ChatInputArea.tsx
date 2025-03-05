// src/components/features/corporate/irchat/ChatInputArea.tsx
import React, { useState, useCallback } from 'react';
import Button from '../../../ui/Button';

/**
 * ChatInputArea コンポーネント
 * テキストエリアと送信ボタンを表示し、ユーザーの入力を受け付けます。
 */
interface ChatInputAreaProps {
  onSend: (text: string) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onSend }) => {
  const [inputText, setInputText] = useState('');

  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      onSend(inputText);
      setInputText('');
    }
  }, [inputText, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex space-x-2">
      <textarea
        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力..."
        rows={2}
      />
      <Button label="送信" onClick={handleSend} />
    </div>
  );
};

export default ChatInputArea;
