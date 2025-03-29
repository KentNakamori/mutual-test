import React from "react";
import Card from "@/components/ui/Card";

interface QAItem {
  id: string;
  title: string;
  createdAt: string;
  views: number;
}

interface DashboardQnAListProps {
  publishedQAs: QAItem[];
  onSelectQA: (id: string) => void;
}

/**
 * DashboardQnAList コンポーネント
 * 「公開済み」の Q&A を表示します。
 */
const DashboardQnAList: React.FC<DashboardQnAListProps> = ({
  publishedQAs,
  onSelectQA,
}) => {
  const renderQAList = (qas: QAItem[]) => {
    return (
      <div className="grid grid-cols-1 gap-4">
        {qas.map((qa) => (
          <Card key={qa.id} onClick={() => onSelectQA(qa.id)} className="cursor-pointer">
            <h4 className="text-lg font-semibold">{qa.title}</h4>
            <p className="text-sm text-gray-500">作成日: {qa.createdAt}</p>
            <p className="text-sm text-gray-500">閲覧数: {qa.views}</p>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Q&A一覧</h3>
      {renderQAList(publishedQAs)}
    </div>
  );
};

export default DashboardQnAList;
