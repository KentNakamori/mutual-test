"use client";

import React from "react";

interface SimpleHeaderProps {
  onLogoClick?: () => void;
}

export default function SimpleHeader({ onLogoClick }: SimpleHeaderProps) {
  return (
    <header className="w-full border-b border-gray-200 p-4">
      <div className="max-w-6xl mx-auto flex items-center">
        {/* ロゴやサイト名部分 */}
        <div
          className="cursor-pointer text-xl font-semibold"
          onClick={onLogoClick}
          aria-label="Go to Top"
        >
          MyCompany
        </div>
        {/* 必要に応じて右側ナビやボタンを配置 */}
      </div>
    </header>
  );
}
