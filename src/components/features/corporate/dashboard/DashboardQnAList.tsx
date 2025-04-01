import React from "react";
import QACard, { QAData } from "@/components/ui/QACard";
import QaDetailModal from "@/components/ui/QaDetailModal"; // 共通QA詳細モーダル

interface DashboardQnAListProps {
  publishedQAs: QAData[];
}

const DashboardQnAList: React.FC<DashboardQnAListProps> = ({ publishedQAs }) => {
  const [selectedQA, setSelectedQA] = React.useState<QAData | null>(null);

  // QAカードがクリックされたときに呼ばれるハンドラ
  const handleCardSelect = (id: string) => {
    const qa = publishedQAs.find((q) => q.id === id) || null;
    setSelectedQA(qa);
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Q&A一覧</h3>
      <div className="grid grid-cols-1 gap-4">
        {publishedQAs.map((qa) => (
          <QACard
            key={qa.id}
            mode="preview"
            role="corporate"
            qa={qa}
            onSelect={handleCardSelect}
          />
        ))}
      </div>
      {selectedQA && (
        <QaDetailModal
          qa={selectedQA}
          role="corporate"
          onClose={() => setSelectedQA(null)}
          onLike={(id: string) => {
            // ここにいいね操作の処理を実装（例：API呼び出し）
            console.log("いいね", id);
          }}
        />
      )}
    </div>
  );
};

export default DashboardQnAList;


