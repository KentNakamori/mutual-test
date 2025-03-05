// components/common/Header.tsx
import React from 'react';

export type NavigationLink = {
  label: string;
  href: string;
};

export interface HeaderProps {
  /** ヘッダーに表示するナビゲーションリンク */
  navigationLinks: NavigationLink[];
  /** ユーザーのログイン状態および名前（ログイン時のみ表示） */
  userStatus: {
    isLoggedIn: boolean;
    userName?: string;
  };
  /** ロゴクリック時の遷移処理 */
  onClickLogo: () => void;
}

/**
 * Header コンポーネント
 * 画面上部に固定表示され、ロゴ、ナビゲーション、ユーザー情報を表示します。
 */
const Header: React.FC<HeaderProps> = ({ navigationLinks, userStatus, onClickLogo }) => {
  return (
    <header className="bg-white text-black shadow-md py-4 px-6 flex justify-between items-center">
      {/* ロゴエリア */}
      <div className="flex items-center cursor-pointer" onClick={onClickLogo}>
        <img src="/logo.png" alt="Logo" className="h-8 w-auto mr-2" />
        <span className="text-xl font-semibold">MyApp</span>
      </div>
      {/* ナビゲーションリンク */}
      <nav className="flex space-x-4">
        {navigationLinks.map((link, index) => (
          <a key={index} href={link.href} className="text-base hover:underline">
            {link.label}
          </a>
        ))}
      </nav>
      {/* ユーザー情報（ログイン時のみ） */}
      {userStatus.isLoggedIn && (
        <div className="flex items-center">
          <span className="mr-2">{userStatus.userName}</span>
          <img src="/user-avatar.png" alt="User Avatar" className="h-8 w-8 rounded-full" />
        </div>
      )}
    </header>
  );
};

export default Header;
