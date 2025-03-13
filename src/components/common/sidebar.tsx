// components/common/Sidebar.tsx
import React, { useState } from 'react';
import Image from 'next/image';

export interface SidebarMenuItem {
  label: string;
  /** 必要に応じてアイコン（shadcnのIconコンポーネント等）を設定可能 */
  icon?: React.ReactNode;
  link: string;
}

export interface SidebarProps {
  /** サイドバーに表示するメニュー項目 */
  menuItems: SidebarMenuItem[];
  /** 折りたたみ可能かどうか */
  isCollapsible?: boolean;
  /** 選択中のメニュー項目（リンクのURLなど） */
  selectedItem?: string;
  /** メニュー項目選択時のコールバック */
  onSelectMenuItem?: (link: string) => void;
}

/**
 * Sidebar コンポーネント
 * サイドバーとしてグループ化されたナビゲーションメニューを表示します。
 */
const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  isCollapsible = false,
  selectedItem,
  onSelectMenuItem,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggleSidebar = () => {
    if (isCollapsible) setIsOpen(!isOpen);
  };

  return (
    <aside className="bg-gray-100 text-gray-700 w-64 p-4">
      {/* ロゴ表示部分 */}
      <div className="flex items-center justify-center mb-4">
        <Image
          src="/images/qa-station-logo.png"
          alt="QA Station Logo"
          width={200}  // 適切な幅に調整してください
          height={50}  // 適切な高さに調整してください
          priority
        />
      </div>

      {isCollapsible && (
        <button
          className="mb-4 text-sm text-blue-600 hover:underline"
          onClick={handleToggleSidebar}
        >
          {isOpen ? 'Collapse' : 'Expand'}
        </button>
      )}

      {isOpen && (
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`p-2 rounded hover:bg-gray-200 cursor-pointer ${
                selectedItem === item.link ? 'bg-gray-300' : ''
              }`}
              onClick={() => onSelectMenuItem && onSelectMenuItem(item.link)}
            >
              <div className="flex items-center space-x-2">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
