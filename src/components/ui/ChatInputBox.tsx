// src/components/ui/ChatInputBox.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatInputBoxProps } from '@/types';

const ChatInputBox: React.FC<ChatInputBoxProps> = ({ 
  onSendMessage, 
  loading = false, 
  inputValue = "",
  onInputChange,
  disabled = false,
  placeholder,
  isSessionSelected = true
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
    if (currentInputValue.trim() === "" || !isSessionSelected) return;
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

  // プレースホルダーの決定
  const getPlaceholder = () => {
    if (!isSessionSelected) {
      return "チャットセッションを選択するか、新規チャットを作成してください";
    }
    return placeholder || "メッセージを入力...";
  };

  // 入力欄の無効化条件
  const isInputDisabled = disabled || loading || !isSessionSelected;

  return (
    <div className="px-6 py-4">
      {/* セッション未選択の警告メッセージ */}
      {!isSessionSelected && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ チャットセッションが選択されていません。メッセージを送信するには、既存のチャットを選択するか新規チャットを作成してください。
          </p>
        </div>
      )}
      
      <div className="flex items-center p-2 bg-gray-50 rounded-lg max-w-5xl mx-auto">
        <textarea
          ref={textareaRef}
          value={currentInputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={getPlaceholder()}
          className={`flex-1 py-2 px-4 resize-none outline-none focus:outline-none text-sm max-h-32 bg-transparent rounded-l-lg overflow-y-auto ${
            isInputDisabled ? 'cursor-not-allowed text-gray-400' : ''
          }`}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && isSessionSelected) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isInputDisabled}
        />
        <div className="flex items-center px-2">
          <button
            onClick={handleSend}
            disabled={!currentInputValue.trim() || isInputDisabled}
            className={`p-2 rounded-lg ${
              !currentInputValue.trim() || isInputDisabled
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
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
