// components/common/MinimalHeader.tsx
import React from 'react';
import Image from 'next/image';
import { MinimalHeaderProps } from '@/types';


/**
 * MinimalHeader コンポーネント
 * 
 * このコンポーネントは以下の機能を提供します：
 * - シンプルなヘッダー表示
 *   - ロゴまたはテキスト表示
 *   - 最小限のナビゲーションリンク
 * 
 * 主な使用シーン：
 * - 認証前の画面（ログイン、パスワードリセットなど）
 * - シンプルなレイアウトが必要な画面
 * 
 * @component
 * @param {MinimalHeaderProps} props - ヘッダーのプロパティ
 * @param {() => void} props.onClickLogo - ロゴクリック時のコールバック関数
 * @param {string} [props.logoText="MyApp"] - ロゴテキスト（画像がない場合に表示）
 * @param {string} [props.logoSrc="/images/qa-station-logo.png"] - ロゴ画像のパス
 * @param {Array<{label: string, href: string}>} [props.links=[]] - ヘッダーに表示するリンクの配列
 * @returns {JSX.Element} シンプルなヘッダーコンポーネント
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
          <Image src={logoSrc} alt="Logo" width={120} height={32} className="h-8 w-auto" />
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

