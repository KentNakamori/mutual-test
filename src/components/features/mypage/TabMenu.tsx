"use client";

import React from "react";

interface TabMenuProps {
  activeTab: "profile" | "password" | "notification" | "delete";
  onChangeTab: (tab: "profile" | "password" | "notification" | "delete") => void;
}

/**
 * マイページ内のタブメニュー
 */
const TabMenu: React.FC<TabMenuProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { key: "profile", label: "プロフィール" },
    { key: "password", label: "パスワード" },
    { key: "notification", label: "通知設定" },
    { key: "delete", label: "アカウント削除" },
  ] as const;

  return (
    <div className="flex space-x-4 border-b border-gray-200 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChangeTab(tab.key)}
          className={`text-sm font-medium px-2 py-1 transition-colors duration-200
            ${
              activeTab === tab.key
                ? "border-b-2 border-black text-black"
                : "text-gray-600 hover:text-black"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabMenu;
