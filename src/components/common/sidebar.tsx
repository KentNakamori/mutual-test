/**
 * Sidebarコンポーネント
 * - 画面の左(または右)側に固定表示し、メニューリンクなどを表示
 * - モバイル時はサイドバーを折りたたむか、shadcnのSheetを使ったオーバーレイ表示にするなど対応可能
 */

import React, { useState } from "react";
import { cn } from "@/libs/utils"; // shadcn UIのユーティリティなど(パスは環境に合わせて)
import Link from "next/link";

type MenuItem = {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

type SidebarProps = {
  /** メニュー項目の配列 */
  menus: MenuItem[];
  /** サイドバー初期開閉状態（PC時: true=常時表示, Mobile時: false=折りたたみ など） */
  defaultOpen?: boolean;
  /** ユーザー種別などでメニューを出し分ける場合があれば */
  userType?: string;
  /** 任意で固定表示の領域(ロゴやユーザー情報など)を差し込む */
  headerContent?: React.ReactNode;
  /** フッターに置きたい要素（例えばバージョン情報など） */
  footerContent?: React.ReactNode;
};

/**
 * Sidebar
 */
const Sidebar: React.FC<SidebarProps> = ({
  menus,
  defaultOpen = true,
  userType,
  headerContent,
  footerContent,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <aside
      className={cn(
        "border-r border-gray-200 bg-white h-screen transition-all duration-200 flex flex-col",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header area (ロゴやユーザー情報など) */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {/* headerContent があれば表示、なければ簡易的にタイトル */}
        {headerContent ? (
          headerContent
        ) : (
          <div className="font-semibold text-lg text-gray-700">Sidebar</div>
        )}
        {/* 開閉トグルボタン */}
        <button
          onClick={handleToggleSidebar}
          className="text-gray-500 hover:text-black"
          aria-label="Toggle sidebar"
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      {/* Menu items */}
      <nav className="flex-1 overflow-y-auto">
        {menus.map((item, idx) => (
          <div
            key={idx}
            className="px-2 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-sm text-gray-700 flex items-center space-x-2"
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}

            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "flex-1 truncate",
                  !isOpen && "hidden" // 開いていない時はテキストを非表示にする例
                )}
                onClick={item.onClick}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "flex-1 truncate",
                  !isOpen && "hidden"
                )}
                onClick={item.onClick}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Footer area */}
      {footerContent && (
        <div className="border-t border-gray-100 p-4 text-sm text-gray-500">
          {footerContent}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
