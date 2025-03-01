"use client"; // Client Component
import React from "react";

/**
 * SimpleHeader
 * - ログイン画面用のシンプルヘッダー
 */
export default function SimpleHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center">
        {/* ロゴやサイト名を表示する例 (固定テキスト) */}
        <div className="text-xl font-bold cursor-pointer">
          MyAppLogo
        </div>
      </div>
    </header>
  );
}
