"use client";

import React from "react";

interface ChatHistoryProps {
  messages: {
    role: "user" | "ai";
    content: string;
    timestamp: string;
  }[];
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded h-80 overflow-y-auto">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs p-2 rounded ${
              msg.role === "user"
                ? "bg-black text-white"
                : "bg-white text-gray-800"
            } shadow-sm`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            <span className="block text-xs text-gray-400 mt-1">
              {msg.timestamp}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
