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
 * ページ下部にコピーライトやフッターリンクを表示します。
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
