/**
 * Layoutコンポーネント
 * - アプリ全体を包む最上位のレイアウト。Header/Sidebar/Footerなどを組み込み、children(メインコンテンツ)を表示
 * - レスポンシブ対応で、モバイル時にはSidebarをSheet表示に切り替えるなども検討可能
 */

import React from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import Footer from "./Footer";

type LayoutProps = {
  /** メインコンテンツ */
  children: React.ReactNode;
  /** ユーザー種別 ("guest", "investor", "company" など) */
  userType?: string;
  /** サイドバーを表示するかどうか (ページによってサイドバー不要の場合) */
  showSidebar?: boolean;
  /** フッターを表示するかどうか (必要に応じて) */
  showFooter?: boolean;
};

/**
 * Layout
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  userType = "guest",
  showSidebar = true,
  showFooter = true,
}) => {
  // 例: userTypeに応じてサイドバーのメニューを分岐
  const sidebarMenus = [
    { label: "Home", href: "/" },
    { label: "MyPage", href: "/mypage" },
    { label: "Settings", href: "/settings" },
  ];

  // investor用メニュー追加例
  if (userType === "investor") {
    sidebarMenus.push({ label: "Favorite Companies", href: "/favorites" });
  }
  // company用メニュー追加例
  if (userType === "company") {
    sidebarMenus.push({ label: "Company Dashboard", href: "/company/dashboard" });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header 固定表示 (必要に応じて) */}
      <Header
        navigationLinks={[
          { label: "Top", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
        // 例: ログイン状態かどうかは上位Contextなどから取得した値を渡す
        isLoggedIn={userType !== "guest"}
      />

      <div className="flex flex-1">
        {/* Sidebar (可否切り替え) */}
        {showSidebar && (
          <Sidebar
            menus={sidebarMenus}
            defaultOpen={userType !== "guest"}
            userType={userType}
            headerContent={<div className="font-bold text-base">Menu</div>}
            footerContent={<div>Version 1.0.0</div>}
          />
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Footer (可否切り替え) */}
      {showFooter && (
        <Footer
          links={[
            { label: "Terms", href: "/terms" },
            { label: "Privacy", href: "/privacy" },
          ]}
          copyright="© 2025 MyApp"
        />
      )}
    </div>
  );
};

export default Layout;
