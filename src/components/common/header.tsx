/**
 * Headerコンポーネント
 * - アプリ全体のヘッダーとして、ロゴやナビゲーションメニュー、ProfileMenu等を表示
 * - Tailwindでスタイルを当てつつ、shadcnコンポーネントを適宜利用可
 */

import React from "react";
import Link from "next/link";
// プロフィールメニューなどをヘッダー内で使う場合
import ProfileMenu from "./ProfileMenu";

type NavigationLink = {
  label: string;
  href: string;
};

type HeaderProps = {
  /** ヘッダーに表示するナビリンク配列 */
  navigationLinks: NavigationLink[];
  /** ロゴクリック時の動作 (トップへ移動など) */
  onLogoClick?: () => void;
  /** ログインユーザーかどうかを示す (未ログインならProfileMenuを非表示にする等) */
  isLoggedIn?: boolean;
};

/**
 * Header
 * @param props HeaderProps
 */
const Header: React.FC<HeaderProps> = ({
  navigationLinks,
  onLogoClick,
  isLoggedIn = false,
}) => {
  return (
    <header className="bg-white text-black shadow-sm w-full">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className="cursor-pointer font-bold text-xl"
          onClick={onLogoClick}
          aria-label="Go to top page"
        >
          MyAppLogo
        </div>

        {/* Global Navigation */}
        <nav className="flex space-x-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-black transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Profile Menu (ログイン時のみ表示) */}
        <div>
          {isLoggedIn ? (
            <ProfileMenu
              userName="John Doe"
              userAvatarUrl="https://example.com/avatar.jpg"
              menuItems={[
                { label: "My Page", value: "mypage" },
                { label: "Logout", value: "logout" },
              ]}
              onSelectMenuItem={(itemValue) => {
                if (itemValue === "logout") {
                  // ここでログアウト処理呼び出しなど
                }
              }}
            />
          ) : (
            // 未ログインならサインインボタン等
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
