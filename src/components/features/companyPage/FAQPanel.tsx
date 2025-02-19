"use client";

import React from "react";

interface FAQPanelProps {
  onSelectFAQ?: (question: string) => void;
}
const DUMMY_FAQ = [
  { question: "製品の価格帯を教えてください", answer: "現在準備中です" },
  { question: "問い合わせ先を知りたい", answer: "support@example.com へ" },
];

export default function FAQPanel({ onSelectFAQ }: FAQPanelProps) {
  return (
    <div className="bg-gray-50 p-4 rounded shadow-sm">
      <h3 className="text-lg font-semibold mb-2">よくある質問</h3>
      <ul className="space-y-2">
        {DUMMY_FAQ.map((faq, index) => (
          <li
            key={index}
            className="bg-white p-3 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelectFAQ?.(faq.question)}
          >
            <p className="text-sm font-medium">{faq.question}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
