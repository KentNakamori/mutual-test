// src/components/ui/ChatInputBox.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatInputBoxProps } from '@/types';

const ChatInputBox: React.FC<ChatInputBoxProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  // テキストエリアの高さを自動調整する
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // 高さをリセットしてから実際のコンテンツの高さに合わせる
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [inputValue]);

  return (
    <div className="p-3">
      <div className="flex items-center p-1 bg-gray-100 rounded-lg">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 py-2 px-4 resize-none outline-none focus:outline-none text-sm max-h-32 bg-transparent rounded-l-lg overflow-y-auto"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <div className="flex items-center px-2">
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`p-2 rounded-lg ${
              inputValue.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-400'
            } transition-colors duration-200 focus:outline-none`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;
