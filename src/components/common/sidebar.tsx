// components/common/sidebar.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';

export interface SidebarMenuItem {
  label: string;
  icon?: React.ReactNode;
  link: string;
}

export interface SidebarProps {
  menuItems: SidebarMenuItem[];
  isCollapsible?: boolean;
  selectedItem?: string;
  onSelectMenuItem?: (link: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  isCollapsible = false,
  selectedItem,
  onSelectMenuItem,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // サイドバー開閉
  const handleToggleSidebar = () => {
    if (isCollapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <aside
      className={`
        bg-gray-100 text-gray-700 p-4
        ${isOpen ? 'w-64' : 'w-16'}   // 開閉に応じて幅を変更したい場合
        transition-all duration-300   // スムーズなアニメーション
      `}
    >
      {/* 上部にアイコンを配置して開閉 */}
      {isCollapsible && (
        <button
          className="mb-4 flex items-center justify-center text-gray-600 hover:text-gray-800"
          onClick={handleToggleSidebar}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      )}

      {/* ロゴ表示部分 */}
      {isOpen && (
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/images/qa-station-logo.png"
            alt="QA Station Logo"
            width={200}
            height={50}
            priority
          />
        </div>
      )}

      {/* メニュー項目 */}
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
