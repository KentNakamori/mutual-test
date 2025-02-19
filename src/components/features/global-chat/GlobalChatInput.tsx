"use client";

import React, { useState } from "react";
import { ChatInputBoxProps } from "@/types/components";

/**
 * 全体チャット入力欄
 */
const GlobalChatInput: React.FC<ChatInputBoxProps> = ({
  onSubmit,
  isDisabled,
}) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        type="text"
        placeholder="質問を入力..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isDisabled}
      />
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
        disabled={isDisabled}
      >
        送信
      </button>
    </form>
  );
};

export default GlobalChatInput;
