"use client";

import React from "react";

interface QADetailModalProps {
  isOpen: boolean;
  qaId: string; // QAの取得に使うなど
  onClose: () => void;
}

export default function QADetailModal({ isOpen, qaId, onClose }: QADetailModalProps) {
  if (!isOpen) return null;

  // 実際には qaId で QAの詳細を取得して表示する
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-lg rounded shadow-lg p-4">
        <button className="float-right text-gray-600" onClick={onClose}>
          ×
        </button>
        <h2 className="text-lg font-semibold mb-2">QA詳細</h2>
        <p className="text-sm text-gray-700 mb-4">
          {/* ダミー文言 */}
          QA ID: {qaId}
        </p>
        {/* いいねボタンやブックマークボタンなど */}
        <button className="bg-black text-white px-3 py-1 rounded">
          いいね
        </button>
      </div>
    </div>
  );
}
