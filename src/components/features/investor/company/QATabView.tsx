import React, { useState } from 'react';
import QASearchBar from './QASearchBar';
import QAList from './QAList';
import QADetailModal from './QADetailModal';

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  likeCount: number;
}

// モックのQAデータ
const mockQAItems: QAItem[] = [
  { id: "qa1", question: "この製品の特徴は何ですか？", answer: "最新のテクノロジーを活用しています。", likeCount: 10 },
  { id: "qa2", question: "保証期間はどのくらいですか？", answer: "購入から1年間保証付きです。", likeCount: 5 },
  { id: "qa3", question: "サポートはどのように提供されますか？", answer: "24時間体制で対応しております。", likeCount: 8 },
];

interface QATabViewProps {
  companyId: string;
}

/**
 * QATabView コンポーネント
 * QA検索バー、QA一覧、詳細モーダルを管理し表示します。
 */
const QATabView: React.FC<QATabViewProps> = ({ companyId }) => {
  const [qaList, setQaList] = useState<QAItem[]>(mockQAItems);
  const [selectedQA, setSelectedQA] = useState<QAItem | null>(null);
  
  const handleSearch = (keyword: string) => {
    // 実際には API で検索しますが、ここではモックデータをフィルタリング
    const filtered = mockQAItems.filter(qa => qa.question.includes(keyword));
    setQaList(filtered);
  };
  
  const handleSelectQA = (qa: QAItem) => {
    setSelectedQA(qa);
  };
  
  const handleCloseModal = () => {
    setSelectedQA(null);
  };
  
  return (
    <div>
      <QASearchBar onSearch={handleSearch} />
      <QAList items={qaList} onSelectQA={handleSelectQA} />
      <QADetailModal qa={selectedQA} open={selectedQA !== null} onClose={handleCloseModal} />
    </div>
  );
};

export default QATabView;
