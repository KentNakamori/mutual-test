// components/ui/Tabs.tsx
import React, { useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  /** タブのリスト */
  tabs: Tab[];
  /** 選択中のタブのID（任意） */
  activeTab?: string;
  /** タブ変更時のハンドラ */
  onChangeTab?: (tabId: string) => void;
}

/**
 * Tabs コンポーネント
 * タブ切り替えでコンテンツ表示を行います。
 */
const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChangeTab }) => {
  const [currentTab, setCurrentTab] = useState(activeTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    onChangeTab && onChangeTab(tabId);
  };

  const currentTabContent = tabs.find(tab => tab.id === currentTab)?.content;

  return (
    <div>
      <div className="flex border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`py-2 px-4 -mb-px border-b-2 transition-colors duration-200 ${
              currentTab === tab.id ? 'border-black font-semibold' : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {currentTabContent}
      </div>
    </div>
  );
};

export default Tabs;
