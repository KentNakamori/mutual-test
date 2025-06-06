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
        className={`py-2 px-4 -mb-px border-b-2 transition-colors duration-200 ${
          activeTab === "qa" 
            ? "border-blue-500 text-blue-600 font-bold" 
            : "border-transparent text-gray-900 hover:text-blue-600"
        }`}
        onClick={() => onChangeTab("qa")}
      >
        QA一覧
      </button>
      <button
        className={`py-2 px-4 -mb-px border-b-2 transition-colors duration-200 ${
          activeTab === "chat" 
            ? "border-blue-500 text-blue-600 font-bold" 
            : "border-transparent text-gray-900 hover:text-blue-600"
        }`}
        onClick={() => onChangeTab("chat")}
      >
        チャット
      </button>
    </div>
  );
};

export default TabSwitcher;
