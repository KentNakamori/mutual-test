"use client";

import React from "react";
import { QAResultListProps } from "@/types/components";

export default function QAResultList({ items, onSelectQA }: QAResultListProps) {
  if (!items.length) {
    return <div className="text-sm text-gray-500">Q&Aがありません。</div>;
  }

  return (
    <ul className="space-y-2">
      {items.map((qa) => (
        <li
          key={qa.qaId}
          onClick={() => onSelectQA(qa.qaId)}
          className="border border-gray-200 bg-white p-3 rounded hover:bg-gray-100 cursor-pointer"
        >
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-800">{qa.question}</p>
            <span className="text-sm text-gray-600">{qa.companyName}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{qa.answerSnippet}</p>
          <div className="text-xs text-gray-500 mt-1">
            いいね: {qa.likeCount} / ブックマーク: {qa.bookmarkCount}
          </div>
        </li>
      ))}
    </ul>
  );
}
