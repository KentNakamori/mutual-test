import React from 'react';

export interface FaqItem {
  id: string;
  question: string;
}

interface FAQPanelProps {
  onSelectFAQ: (faqText: string) => void;
}

// モックのFAQデータ
const mockFaqs: FaqItem[] = [
  { id: "faq1", question: "営業時間は何時ですか？" },
  { id: "faq2", question: "サポートはどこにありますか？" },
  { id: "faq3", question: "返品ポリシーはどうなっていますか？" },
];

/**
 * FAQPanel コンポーネント
 * よくある質問の一覧を表示し、選択時にコールバックを呼び出します。
 */
const FAQPanel: React.FC<FAQPanelProps> = ({ onSelectFAQ }) => {
  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-lg font-semibold mb-2">よくある質問</h2>
      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {mockFaqs.map((faq) => (
          <li
            key={faq.id}
            className="p-2 bg-white rounded hover:bg-gray-200 cursor-pointer"
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
