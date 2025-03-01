// src/components/features/companies/ChatView/ChatMessage.tsx
import React from "react";
import { ChatMessage as ChatMessageType } from "@/types/domain/chat";
import { cn } from "@/libs/utils";

type ChatMessageProps = {
  message: ChatMessageType;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex mb-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-sm p-2 rounded",
          isUser ? "bg-gray-200 text-black" : "bg-black text-white"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        {message.references && message.references.length > 0 && (
          <ul className="mt-1 text-xs text-gray-300">
            {message.references.map((ref, idx) => (
              <li key={idx}>参考: {ref}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
