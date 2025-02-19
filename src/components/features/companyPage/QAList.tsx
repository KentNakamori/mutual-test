"use client";

import React from "react";

interface QAItem {
  qaId: string;
  question: string;
  answer: string;
  likeCount: number;
  bookmarkCount: number;
}

interface QAListProps {
  items: QAItem[];
  onSelectQA: (qaId: string) => void;
}

export default function QAList({ items, onSelectQA }: QAListProps) {
  if (!items.length) {
    return <div className="text-sm text-gray-600">Q&Aがありません。</div>;
  }

  return (
    <ul className="space-y-2">
      {items.map((qa) => (
        <li
          key={qa.qaId}
          className="p-3 bg-white rounded border hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelectQA(qa.qaId)}
        >
          <p className="text-sm font-medium">{qa.question}</p>
          {/* いいね数など */}
          <div className="text-xs text-gray-500 mt-1">
            いいね: {qa.likeCount} / ブックマーク: {qa.bookmarkCount}
          </div>
        </li>
      ))}
    </ul>
  );
}
