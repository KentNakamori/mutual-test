"use client";

import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface GlobalChatInputProps {
  /** メッセージ送信時のハンドラ */
  onSendMessage: (text: string) => void;
  /** 入力を無効化するか (AI回答待ち時など) */
  disabled?: boolean;
  /** プレースホルダ */
  placeholder?: string;
}

/**
 * チャットの送信用フォーム
 */
const GlobalChatInput: React.FC<GlobalChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");

  // Enter押下で送信するかどうかは運用次第
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <Input
          disabled={disabled}
          value={inputValue}
          placeholder={placeholder || "メッセージを入力"}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <Button
        variant="default"
        onClick={handleSend}
        disabled={disabled}
        className="whitespace-nowrap"
      >
        送信
      </Button>
    </div>
  );
};

export default GlobalChatInput;
