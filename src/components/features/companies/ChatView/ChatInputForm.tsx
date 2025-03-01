// src/components/features/companies/ChatView/ChatInputForm.tsx
import React, { useState } from "react";

type ChatInputFormProps = {
  onSubmit: (messageText: string) => void;
  disabled?: boolean;
};

const ChatInputForm: React.FC<ChatInputFormProps> = ({ onSubmit, disabled }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSubmit(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <textarea
        className="flex-1 border border-gray-300 rounded p-2 text-sm"
        rows={2}
        disabled={disabled}
        placeholder="メッセージを入力（Enterで送信）"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={disabled}
        onClick={handleSend}
      >
        送信
      </button>
    </div>
  );
};

export default ChatInputForm;
