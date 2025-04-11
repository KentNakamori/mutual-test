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
  const [isOpen, setIsOpen] = useState(defaultCollapsed ? false : true);

  const handleToggleSidebar = () => {
    if (isCollapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <aside
      className={`
        bg-gray-100 text-gray-700 p-2
        ${isOpen ? 'w-64' : 'w-16'}
        transition-all duration-300 relative
      `}
    >
      {/* トグルボタン（常に表示） */}
      <button
        className="absolute top-2 right-[-12px] z-20 p-1 bg-gray-100 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-200"
        onClick={handleToggleSidebar}
      >
        {isOpen ? <FaAngleDoubleLeft size={20} /> : <FaBars size={20} />}
      </button>

      {isOpen && (
        <>
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/images/qa-station-logo.png"
              alt="QA Station Logo"
              width={200}
              height={50}
              priority
            />
          </div>
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
        </>
      )}
    </aside>
  );
};

export default Sidebar;
