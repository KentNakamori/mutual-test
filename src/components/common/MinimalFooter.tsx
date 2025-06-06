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
 *   - 運営会社へのリンク
 *   - お問い合わせボタン
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
    <footer className="bg-gray-50 text-gray-600 py-4 px-4 flex flex-col items-center space-y-3">
      {/* お問い合わせボタン */}
      <div className="flex justify-center">
        <a
          href="https://mutual-inc.co.jp/contact/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-cyan-400 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-cyan-500 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          お問い合わせ
        </a>
      </div>

      {/* 既存のリンク */}
      {footerLinks.length > 0 && (
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
      )}

      {/* 運営会社リンク */}
      <div className="text-xs">
        運営会社：
        <a
          href="https://mutual-inc.co.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline ml-1"
        >
          株式会社Mutual
        </a>
      </div>

      {/* コピーライト */}
      <div className="text-xs">
        &copy; {new Date().getFullYear()} {copyrightText}
      </div>
    </footer>
  );
};

export default MinimalFooter;
