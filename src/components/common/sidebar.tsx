// src/components/common/sidebar.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { FaBars, FaAngleDoubleLeft } from 'react-icons/fa';
import { SidebarMenuItem, SidebarProps } from '@/types';

interface ExtendedSidebarProps extends SidebarProps {
  defaultCollapsed?: boolean;
}

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
        bg-gray-100 text-gray-700 p-2 h-screen
        ${isOpen ? 'w-64' : 'w-16'}
        transition-all duration-300 ease-in-out relative
        flex-shrink-0
      `}
    >
      {/* ロゴまたはトグルボタン */}
      <div className="flex items-center justify-center mb-4 h-12">
        {isOpen ? (
          <>
            <button
              className="p-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
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
            className="p-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
            onClick={handleToggleSidebar}
          >
            <FaBars size={20} />
          </button>
        )}
      </div>

      {/* メニュー項目 */}
      <ul className="space-y-2">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`p-2 rounded hover:bg-gray-200 cursor-pointer transition-colors ${
              selectedItem === item.link ? 'bg-gray-300' : ''
            }`}
            onClick={() => onSelectMenuItem && onSelectMenuItem(item.link)}
          >
            <div className={`flex items-center h-10 ${isOpen ? 'space-x-2' : 'justify-center'}`}>
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {isOpen && <span className="truncate">{item.label}</span>}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
