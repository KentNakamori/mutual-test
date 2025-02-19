"use client";

import React from "react";
import ChatLogsMainContainer from "@/components/features/chatLogs/ChatLogsMainContainer";

export default function ChatLogsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 共通のHeaderやFooterはlayout.tsxや上位レイアウトでラップすると想定 */}
      <main className="flex-grow">
        <ChatLogsMainContainer />
      </main>
    </div>
  );
}
