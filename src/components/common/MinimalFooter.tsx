// components/common/MinimalFooter.tsx
import React from 'react';
import { MinimalFooterProps } from '@/types';

/**
 * MinimalFooter コンポーネント
 * 
 * このコンポーネントは以下の機能を提供します：
 * - シンプルなフッター表示
 *   - コピーライト表示
 *   - 最小限のリンク表示
 * 
 * 主な使用シーン：
 * - 認証前の画面（ログイン、サインアップなど）
 * - シンプルなレイアウトが必要な画面
 * 
 * @component
 * @param {MinimalFooterProps} props - フッターのプロパティ
 * @param {Array<{label: string, href: string}>} [props.footerLinks=[]] - フッターに表示するリンクの配列
 * @param {string} props.copyrightText - コピーライトテキスト
 * @param {(href: string) => void} [props.onSelectLink] - リンククリック時のコールバック関数
 * @returns {JSX.Element} シンプルなフッターコンポーネント
 */
const MinimalFooter: React.FC<MinimalFooterProps> = ({
  footerLinks = [],
  copyrightText,
  onSelectLink,
}) => {
  return (
    <footer className="bg-gray-50 text-gray-600 py-2 px-4 flex flex-col items-center">
      <div className="text-xs mb-1">
        &copy; {new Date().getFullYear()} {copyrightText}
      </div>
      <div className="flex space-x-2">
        {footerLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            onClick={(e) => {
              if (onSelectLink) {
                e.preventDefault();
                onSelectLink(link.href);
              }
            }}
            className="text-xs hover:underline"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default MinimalFooter;
