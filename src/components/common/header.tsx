/**
 * @file components/common/Header.tsx
 * @description 全ページ共通のヘッダー。ロゴやナビゲーション、右上のプロフィール等
 */

import React from "react";
import ProfileMenu from "./ProfileMenu";

type HeaderProps = {
  /** ユーザー種別で表示切り替えたい場合に使用 */
  userType?: string;
  /** ロゴをクリックした際の動作 */
  onLogoClick?: () => void;
  /** プロフィールアイコンクリック時の開閉など (例示) */
  onProfileClick?: () => void;
  /** ナビリンククリック時に使うかもしれないコールバック */
  onNavigate?: (path: string) => void;
};

const Header: React.FC<HeaderProps> = ({
  userType = "guest",
  onLogoClick,
  onProfileClick,
  onNavigate,
}) => {
  return (
    <header className="w-full h-14 flex items-center justify-between px-4 border-b bg-white">
      {/* 左：ロゴ */}
      <div onClick={onLogoClick} className="cursor-pointer font-bold text-lg">
        MyLogo
      </div>

      {/* 右：プロフィール or ログインボタン */}
      <div>
        {userType === "guest" ? (
          <button
            className="text-sm text-gray-600 hover:underline"
            onClick={() => onNavigate && onNavigate("/login")}
          >
            ログイン
          </button>
        ) : (
          <ProfileMenu
            userName="Sample User"
            userAvatarUrl=""
            menuItems={[
              { label: "マイページ", value: "mypage" },
              { label: "ログアウト", value: "logout" },
            ]}
            onSelectMenuItem={(val) => console.log("選択:", val)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
