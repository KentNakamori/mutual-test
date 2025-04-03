import React from "react";
import QACard, { QAData } from "@/components/ui/QACard";
import QaDetailModal from "@/components/ui/QaDetailModal"; // 共通QA詳細モーダル
import { DashboardQA,  DashboardQnAListProps } from "@/types"; // 型定義ファイルからインポート



const DashboardQnAList: React.FC<DashboardQnAListProps> = ({ publishedQAs }) => {
  const [selectedQA, setSelectedQA] = React.useState<DashboardQA | null>(null);

  // QAカードがクリックされたときに呼ばれるハンドラ
  const handleCardSelect = (id: string) => {
    const qa = publishedQAs.find((q) => q.qaId === id) || null;
    setSelectedQA(qa);
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Q&A一覧</h3>
      <div className="grid grid-cols-1 gap-4">
        {publishedQAs.map((qa) => (
          <QACard
            key={qa.qaId}
            mode="preview"
            role="corporate"
            // QACard が期待する QAData 型は、id プロパティと views プロパティを持つため、
            // DashboardQA の qaId を id に変換して渡します
            qa={{ ...qa, id: qa.qaId }}
            onSelect={handleCardSelect}
          />
        ))}
      </div>
      {selectedQA && (
        <QaDetailModal
          // 同様に変換して渡す
          qa={{ ...selectedQA, id: selectedQA.qaId }}
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
