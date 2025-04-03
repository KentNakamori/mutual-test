import React from 'react';
import { HeaderProps } from '@/types';

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
