// src/components/ui/ChatInputBox.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatInputBoxProps } from '@/types';

const ChatInputBox: React.FC<ChatInputBoxProps> = ({ 
  onSendMessage, 
  loading = false, 
  inputValue = "",
  onInputChange 
}) => {
  const [internalInputValue, setInternalInputValue] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 外部から制御される場合は外部の値を使用、そうでなければ内部の値を使用
  const currentInputValue = onInputChange ? inputValue : internalInputValue;
  
  const handleInputChange = (value: string) => {
    if (onInputChange) {
      onInputChange(value);
    } else {
      setInternalInputValue(value);
    }
  };

  const handleSend = () => {
    if (currentInputValue.trim() === "") return;
    onSendMessage(currentInputValue);
    handleInputChange("");
  };

  // テキストエリアの高さを自動調整する
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // 高さをリセットしてから実際のコンテンツの高さに合わせる
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [currentInputValue]);

  return (
    <div className="px-6 py-4">
      <div className="flex items-center p-2 bg-gray-50 rounded-lg max-w-5xl mx-auto">
        <textarea
          ref={textareaRef}
          value={currentInputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 py-2 px-4 resize-none outline-none focus:outline-none text-sm max-h-32 bg-transparent rounded-l-lg overflow-y-auto"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
        />
        <div className="flex items-center px-2">
          <button
            onClick={handleSend}
            disabled={!currentInputValue.trim() || loading}
            className={`p-2 rounded-lg ${
              !currentInputValue.trim() || loading
                ? 'bg-gray-300 text-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors duration-200 focus:outline-none`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                送信中
              </span>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;
