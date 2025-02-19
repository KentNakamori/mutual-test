/**
 * @file components/common/Sidebar.tsx
 * @description 画面左/右に配置し、メニューリンクやフィルタ操作などを提供する
 */

import React from "react";

type MenuItem = {
  label: string;
  icon?: string;
  link: string;
};

type SidebarProps = {
  userType?: string;
  menus: MenuItem[];
  isOpen?: boolean;
  onToggleSidebar?: () => void;
  onNavigateMenu?: (menu: MenuItem) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  userType = "guest",
  menus,
  isOpen = true,
  onToggleSidebar,
  onNavigateMenu,
}) => {
  return (
    <aside
      className={`transition-all duration-200 border-r bg-gray-50 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="text-sm font-semibold text-gray-700">
          {userType === "investor" && "投資家メニュー"}
          {userType === "company" && "企業メニュー"}
          {userType === "guest" && "ゲストメニュー"}
        </span>
        <button
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={onToggleSidebar}
        >
          {isOpen ? "<<" : ">>"}
        </button>
      </div>

      <nav className="flex-1 overflow-auto">
        {menus.map((menu, idx) => (
          <button
            key={idx}
            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
            onClick={() => onNavigateMenu && onNavigateMenu(menu)}
          >
            {menu.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
