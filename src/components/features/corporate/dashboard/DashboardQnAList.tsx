// src/components/features/corporate/qa/DashboardQnAList.tsx
import React from "react";
import QACard from "@/components/ui/QACard";
import QaDetailModal from "@/components/ui/QaDetailModal";
import { QA, DashboardQnAListProps } from "@/types";

const DashboardQnAList: React.FC<DashboardQnAListProps> = ({ 
  publishedQAs, 
  onSelectQA, 
  onUpdateQA, 
  onDeleteQA 
}) => {
  const [selectedQA, setSelectedQA] = React.useState<QA | null>(null);

  // QAカードがクリックされたときのハンドラ
  const handleCardSelect = (id: string) => {
    const qa = publishedQAs.find((q) => q.qaId === id) || null;
    setSelectedQA(qa);
  };

  // QA更新処理
  const handleSaveEdit = async (updatedQA: QA) => {
    onUpdateQA(updatedQA);
    setSelectedQA(null);
  };

  // QA削除処理
  const handleDelete = async (qaId: string) => {
    onDeleteQA(qaId);
    setSelectedQA(null);
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">最新公開済みQ&A一覧</h3>
      <div className="grid grid-cols-1 gap-4">
        {publishedQAs.map((qa) => (
          <QACard
            key={qa.qaId}
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
          isOpen={true}
          onClose={() => setSelectedQA(null)}
          onLike={async (id: string) => {
            console.log("いいね", id);
          }}
          onSaveEdit={handleSaveEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default DashboardQnAList;
