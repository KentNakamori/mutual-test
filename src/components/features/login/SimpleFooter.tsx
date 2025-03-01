"use client";
import React from "react";

/**
 * SimpleFooter
 * - ログインページ用の簡易フッター
 */
export default function SimpleFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-3 mt-8">
      <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
        <p className="mb-2">
          <a href="/terms" className="hover:underline">
            利用規約
          </a>
          {" | "}
          <a href="/privacy" className="hover:underline">
            プライバシーポリシー
          </a>
        </p>
        <p className="text-xs">© 2025 My Awesome App</p>
      </div>
    </footer>
  );
}
