//src\components\features\investor\company\TabSwitcher.tsx

import React from 'react';
import { TabSwitcherProps } from '../../../../types';


/**
 * TabSwitcher コンポーネント
 * 「チャット」と「QA一覧」タブの切り替えを行います。
 */
const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onChangeTab }) => {
  return (
    <div className="flex border-b border-gray-300 mb-4">
      <button
        className={`py-2 px-4 -mb-px border-b-2 transition-colors duration-200 ${activeTab === "qa" ? "border-black font-semibold" : "border-transparent text-gray-500 hover:text-black"}`}
        onClick={() => onChangeTab("qa")}
      >
        QA一覧
      </button>
      <button
        className={`py-2 px-4 -mb-px border-b-2 transition-colors duration-200 ${activeTab === "chat" ? "border-black font-semibold" : "border-transparent text-gray-500 hover:text-black"}`}
        onClick={() => onChangeTab("chat")}
      >
        チャット
      </button>
    </div>
  );
};

export default TabSwitcher;
