// components/common/MinimalHeader.tsx
import React from 'react';

export interface MinimalHeaderProps {
  /** ロゴクリック時の処理 */
  onClickLogo: () => void;
  /** 表示するロゴテキスト（任意） */
  logoText?: string;
  /** ロゴ画像のパス（任意） */
  logoSrc?: string;
  /** 最小限のリンクリスト */
  links?: { label: string; href: string }[];
}

/**
 * MinimalHeader コンポーネント
 * 認証前画面（ログイン・パスワードリセット等）でシンプルにロゴと最低限のリンクのみを表示します。
 */
const MinimalHeader: React.FC<MinimalHeaderProps> = ({
  onClickLogo,
  logoText = "MyApp",
  logoSrc = "/images/qa-station-logo.png",
  links = [],
}) => {
  return (
    <header className="bg-white text-black py-3 px-4 flex justify-between items-center">
      <div className="cursor-pointer flex items-center" onClick={onClickLogo}>
        {logoSrc ? (
          <img src={logoSrc} alt="Logo" className="h-8 w-auto" />
        ) : (
          <span className="text-xl font-bold">{logoText}</span>
        )}
      </div>
      <nav className="flex space-x-2">
        {links.map((link, index) => (
          <a key={index} href={link.href} className="text-sm hover:underline">
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default MinimalHeader;

