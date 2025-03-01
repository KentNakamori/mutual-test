/**
 * Footerコンポーネント
 * - アプリ全体のフッターとして、コピーライト表記や利用規約等のリンクを表示
 */

import React from "react";

type FooterLink = {
  label: string;
  href: string;
};

type FooterProps = {
  /** 利用規約やポリシー等のリンク */
  links?: FooterLink[];
  /** コピーライト表記に表示する年や文言 */
  copyright?: string;
};

const Footer: React.FC<FooterProps> = ({
  links = [],
  copyright,
}) => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        {/* Footer Links */}
        <ul className="flex space-x-4 text-sm text-gray-600">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:text-black transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Copyright */}
        <div className="text-sm text-gray-500">
          {copyright || "© 2025 My Awesome App"}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
