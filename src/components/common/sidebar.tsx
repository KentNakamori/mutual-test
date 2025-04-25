// src/components/common/sidebar.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { FaBars, FaAngleDoubleLeft } from 'react-icons/fa';
import { SidebarMenuItem, SidebarProps } from '@/types';

interface ExtendedSidebarProps extends SidebarProps {
  defaultCollapsed?: boolean;
}

/**
 * Sidebar コンポーネント
 * 
 * このコンポーネントは以下の機能を提供します：
 * - サイドバーナビゲーション
 *   - 折りたたみ可能なメニュー
 *   - アイコンとラベルの表示
 *   - 選択状態の視覚的フィードバック
 * 
 * 主な機能：
 * - サイドバーの展開/折りたたみ
 * - メニュー項目の選択
 * - レスポンシブデザイン
 * - アニメーション付きの遷移
 * 
 * @component
 * @param {SidebarProps} props - サイドバーのプロパティ
 * @param {Array<SidebarMenuItem>} props.menuItems - メニュー項目の配列
 * @param {boolean} [props.isCollapsible=true] - サイドバーを折りたたみ可能かどうか
 * @param {string} [props.selectedItem] - 現在選択されているメニュー項目のリンク
 * @param {(link: string) => void} [props.onSelectMenuItem] - メニュー項目選択時のコールバック関数
 * @param {boolean} [props.defaultCollapsed=false] - デフォルトで折りたたまれた状態かどうか
 * @returns {JSX.Element} サイドバーナビゲーションコンポーネント
 */
const Sidebar: React.FC<ExtendedSidebarProps> = ({
  menuItems,
  isCollapsible,
  selectedItem,
  onSelectMenuItem,
  defaultCollapsed = false,
}) => {
  const [isOpen, setIsOpen] = useState(!defaultCollapsed);

  const handleToggleSidebar = () => {
    if (isCollapsible !== false) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <aside
      className={`
        bg-white text-gray-700 p-2
        ${isOpen ? 'w-64' : 'w-16'}
        transition-all duration-300 ease-in-out
        flex-shrink-0 flex flex-col
        border-r border-gray-200
        h-screen sticky top-0 left-0
      `}
    >
      {/* ロゴまたはトグルボタン */}
      <div className="flex items-center justify-center mb-4 h-12">
        {isOpen ? (
          <>
            <button
              className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={handleToggleSidebar}
            >
              <FaAngleDoubleLeft size={20} />
            </button>
            <div className="flex-1 flex justify-center">
              <Image
                src="/images/qa-station-logo.png"
                alt="QA Station Logo"
                width={160}
                height={40}
                priority
              />
            </div>
          </>
        ) : (
          <button
            className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={handleToggleSidebar}
          >
            <FaBars size={20} />
          </button>
        )}
      </div>

      {/* メニュー項目 */}
      <ul className="space-y-2 flex-grow">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors ${
              selectedItem === item.link ? 'border-l-4 border-blue-500 bg-gray-50' : ''
            }`}
            onClick={() => onSelectMenuItem && onSelectMenuItem(item.link)}
          >
            <div className={`flex items-center h-10 ${isOpen ? 'space-x-2' : 'justify-center'}`}>
              {item.icon && <span className={`flex-shrink-0 ${selectedItem === item.link ? 'text-blue-500' : ''}`}>{item.icon}</span>}
              {isOpen && <span className={`truncate ${selectedItem === item.link ? 'text-blue-500 font-medium' : ''}`}>{item.label}</span>}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
