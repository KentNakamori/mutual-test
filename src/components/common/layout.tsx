/**
 * @file components/common/Layout.tsx
 * @description アプリ全体の共通レイアウトを担うラッパーコンポーネント
 */

import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

type LayoutProps = {
  /** ユーザー種別（"guest" / "investor" / "company" 等） */
  userType?: string;
  /** メインコンテンツを挿入するスロット */
  children: React.ReactNode;
  /** サイドバーの開閉をトグルするイベントハンドラ */
  onToggleSidebar?: () => void;
  /** ログアウト時の処理など */
  onLogout?: () => void;
};

/**
 * Layout コンポーネント
 * - 全体を包むコンテナとして、ヘッダー・サイドバー・フッターを配置
 * - isSidebarOpen などの状態を持ち、開閉制御できる例
 */
const Layout: React.FC<LayoutProps> = ({
  userType = "guest",
  children,
  onToggleSidebar,
  onLogout,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <Header userType={userType} onLogoClick={() => console.log("Logo clicked")} />

      <div className="flex flex-1">
        {/* サイドバー */}
        <Sidebar
          userType={userType}
          menus={[
            { label: "トップ", icon: "home", link: "/" },
            { label: "フォロー企業", icon: "star", link: "/follows" },
          ]}
          isOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          onNavigateMenu={(menu) => console.log("navigate:", menu.link)}
        />

        {/* メインコンテンツ */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Layout;
