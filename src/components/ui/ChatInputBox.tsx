// src/components/features/investor/company/ChatInputBox.tsx
import React, { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { ChatInputBoxProps } from '@/types';

const ChatInputBox: React.FC<ChatInputBoxProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center p-1">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力..."
          className="flex-1 py-2 px-3 resize-none outline-none text-sm max-h-32"
          rows={1}
        />
        <div className="flex items-center px-2">
          <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
            <Paperclip size={18} />
          </button>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`ml-1 p-1.5 rounded-md ${
              inputValue.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;
