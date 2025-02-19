/**
 * @file components/common/Footer.tsx
 * @description ページ下部のフッター。利用規約や問い合わせ先などを表示
 */

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-gray-100 py-2 text-center text-xs text-gray-600">
      <div className="container mx-auto">
        <p>
          <a
            href="/terms"
            className="underline hover:text-gray-800"
          >
            利用規約
          </a>{" "}
          |{" "}
          <a
            href="/privacy"
            className="underline hover:text-gray-800"
          >
            プライバシーポリシー
          </a>{" "}
          |{" "}
          <a
            href="/contact"
            className="underline hover:text-gray-800"
          >
            お問い合わせ
          </a>
        </p>
        <p className="text-gray-500 mt-1">
          &copy; 2025 MyService Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
