// src/components/features/companies/ChatView/FAQPanel.tsx
import React from "react";

type FAQPanelProps = {
  onSelectFAQ: (question: string) => void;
};

const FAQPanel: React.FC<FAQPanelProps> = ({ onSelectFAQ }) => {
  // 仮モックのFAQ一覧
  const faqList = [
    { question: "御社のビジネスモデルを教えてください。" },
    { question: "配当はどれくらい出ますか？" },
    { question: "競合優位性は何ですか？" },
  ];

  return (
    <div className="p-2 border border-gray-200 rounded">
      <h2 className="text-lg font-semibold mb-2">よくある質問</h2>
      <ul className="space-y-1">
        {faqList.map((faq, idx) => (
          <li
            key={idx}
            className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded"
            onClick={() => onSelectFAQ(faq.question)}
          >
            {faq.question}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQPanel;
