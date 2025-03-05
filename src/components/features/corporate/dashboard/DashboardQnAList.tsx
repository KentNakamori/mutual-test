// src/components/features/dashboard/DashboardQnAList.tsx
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
  draftQAs: QAItem[];
  hotQAs: QAItem[];
  onSelectQA: (id: string) => void;
}

/**
 * DashboardQnAList コンポーネント
 * 「公開済み」「準備中」「注目」の各カテゴリーの Q&A をタブ切替で表示します。
 */
const DashboardQnAList: React.FC<DashboardQnAListProps> = ({
  publishedQAs,
  draftQAs,
  hotQAs,
  onSelectQA,
}) => {
  const [activeTab, setActiveTab] = React.useState<"published" | "drafts" | "hot">("published");

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
      <div className="flex space-x-4 mb-4 border-b border-gray-300">
        <button
          className={`py-2 px-4 -mb-px border-b-2 transition-colors duration-200 ${
            activeTab === "published" ? "border-black font-semibold" : "border-transparent text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("published")}
        >
          公開済み
        </button>
        <button
          className={`py-2 px-4 -mb-px border-b-2 transition-colors duration-200 ${
            activeTab === "drafts" ? "border-black font-semibold" : "border-transparent text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("drafts")}
        >
          準備中
        </button>
        <button
          className={`py-2 px-4 -mb-px border-b-2 transition-colors duration-200 ${
            activeTab === "hot" ? "border-black font-semibold" : "border-transparent text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("hot")}
        >
          注目
        </button>
      </div>
      <div>
        {activeTab === "published" && renderQAList(publishedQAs)}
        {activeTab === "drafts" && renderQAList(draftQAs)}
        {activeTab === "hot" && renderQAList(hotQAs)}
      </div>
    </div>
  );
};

export default DashboardQnAList;
