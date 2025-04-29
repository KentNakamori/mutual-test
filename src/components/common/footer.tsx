// components/common/Footer.tsx
import React from 'react';

export interface FooterProps {
  /** フッターに表示するリンクリスト（例: 利用規約、問い合わせなど） */
  footerLinks?: { label: string; href: string }[];
  /** コピーライトテキスト */
  copyrightText: string;
  /** リンククリック時のコールバック（任意） */
  onSelectLink?: (href: string) => void;
}

/**
 * Footer コンポーネント
 * 
 * このコンポーネントは以下の機能を提供します：
 * - ページ下部のフッター表示
 *   - コピーライト表示
 *   - ナビゲーションリンク
 *   - カスタマイズ可能なリンククリックハンドラ
 * 
 * 主な特徴：
 * - レスポンシブデザイン
 * - カスタマイズ可能なリンク
 * - シンプルでクリーンなデザイン
 * 
 * @component
 * @param {FooterProps} props - フッターのプロパティ
 * @param {Array<{label: string, href: string}>} [props.footerLinks=[]] - フッターに表示するリンクの配列
 * @param {string} props.copyrightText - コピーライトテキスト
 * @param {(href: string) => void} [props.onSelectLink] - リンククリック時のコールバック関数
 * @returns {JSX.Element} フッターコンポーネント
 */
const Footer: React.FC<FooterProps> = ({
  footerLinks = [],
  copyrightText,
  onSelectLink,
}) => {
  return (
    <footer className="bg-gray-50 text-gray-600 py-4 px-6 flex flex-col items-center">
      <div className="flex space-x-4 mb-2">
        {footerLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            onClick={() => onSelectLink && onSelectLink(link.href)}
            className="text-sm hover:underline"
          >
            {link.label}
          </a>
        ))}
      </div>
      <div className="text-xs">
        &copy; {new Date().getFullYear()} {copyrightText}
      </div>
    </footer>
  );
};

export default Footer;
