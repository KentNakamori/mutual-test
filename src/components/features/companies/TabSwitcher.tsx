// src/components/features/companies/TabSwitcher.tsx
import React from "react";
import { cn } from "@/libs/utils";

type Tab = {
  key: "chat" | "qa"; // 今回は2タブ想定
  label: string;
};

type TabSwitcherProps = {
  tabs: Tab[];
  activeTab: "chat" | "qa";
  onChangeTab: (tab: "chat" | "qa") => void;
};

const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs, activeTab, onChangeTab }) => {
  return (
    <div className="flex space-x-4 border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onChangeTab(tab.key)}
            className={cn(
              "py-2 px-4 transition-colors duration-200",
              isActive
                ? "border-b-2 border-black text-black font-semibold"
                : "text-gray-500 hover:text-black"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabSwitcher;
