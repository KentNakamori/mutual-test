// components/common/Sidebar.tsx
import React, { useState } from 'react';
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

  const handleToggleSidebar = () => {
    if (isCollapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <aside
      className={`
        bg-gray-100 text-gray-700 h-screen 
        transition-all duration-300 
        ${isOpen ? 'w-64' : 'w-16'} 
        flex flex-col
      `}
    >
      {/* ロゴと開閉ボタン */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        {isOpen && (
          <img
            src="/path/to/logo.png"
            alt="Logo"
            className="h-8 w-auto"
          />
        )}
        <button onClick={handleToggleSidebar} aria-label="Toggle Sidebar">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* メニュー項目 */}
      <ul className="flex-1 overflow-y-auto mt-2">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`
              flex items-center p-2 cursor-pointer 
              hover:bg-gray-200 
              ${selectedItem === item.link ? 'bg-gray-300' : ''}
            `}
            onClick={() => onSelectMenuItem && onSelectMenuItem(item.link)}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {isOpen && <span>{item.label}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
