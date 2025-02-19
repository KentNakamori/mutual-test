"use client";

import React, { useState } from "react";

interface ChatInputFormProps {
  onSend: (text: string) => void;
}

export default function ChatInputForm({ onSend }: ChatInputFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="flex-1 border border-gray-300 rounded px-3 py-2"
        placeholder="メッセージを入力..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
      >
        送信
      </button>
    </form>
  );
}
