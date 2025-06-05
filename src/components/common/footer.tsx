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
 *   - 運営会社へのリンク
 *   - お問い合わせボタン
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
    <footer className="bg-gray-50 text-gray-600 py-4 px-6 flex flex-col items-center space-y-3">
      {/* お問い合わせボタンと運営会社リンクを横並びに */}
      <div className="flex flex-row items-center justify-center space-x-6 w-full">
        {/* 運営会社リンク（大きく・強調） */}
        <div className="text-base font-semibold">
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
        {/* お問い合わせボタン */}
        <a
          href="https://mutual-inc.co.jp/contact/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-cyan-400 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-cyan-500 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          お問い合わせ
        </a>
      </div>
    </footer>
  );
};

export default Footer;
