// components/common/MinimalFooter.tsx
import React from 'react';

export interface MinimalFooterProps {
  /** 最小限のフッターリンクリスト（任意） */
  footerLinks?: { label: string; href: string }[];
  /** コピーライトテキスト */
  copyrightText: string;
}

/**
 * MinimalFooter コンポーネント
 * 認証前画面などでシンプルなコピーライト表示と最低限のリンクを提供します。
 */
const MinimalFooter: React.FC<MinimalFooterProps> = ({
  footerLinks = [],
  copyrightText,
}) => {
  return (
    <footer className="bg-gray-50 text-gray-600 py-2 px-4 flex flex-col items-center">
      <div className="text-xs mb-1">
        &copy; {new Date().getFullYear()} {copyrightText}
      </div>
      <div className="flex space-x-2">
        {footerLinks.map((link, index) => (
          <a key={index} href={link.href} className="text-xs hover:underline">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default MinimalFooter;
