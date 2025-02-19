"use client";

import React from "react";

interface TabSwitcherProps {
  activeTab: "chat" | "qa";
  onChangeTab: (tab: string) => void;
}

export default function TabSwitcher({ activeTab, onChangeTab }: TabSwitcherProps) {
  return (
    <div className="flex gap-4 p-2">
      <button
        onClick={() => onChangeTab("chat")}
        className={`px-4 py-2 rounded ${
          activeTab === "chat" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
        }`}
      >
        チャット
      </button>
      <button
        onClick={() => onChangeTab("qa")}
        className={`px-4 py-2 rounded ${
          activeTab === "qa" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
        }`}
      >
        Q&A
      </button>
    </div>
  );
}
