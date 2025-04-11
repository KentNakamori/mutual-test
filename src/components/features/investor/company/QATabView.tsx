import React, { useState, useEffect } from 'react';
import QASearchBar from './QASearchBar';
import QAResultList from '@/components/features/investor/qa/QAResultList';
import QADetailModal from '@/components/ui/QaDetailModal';
import { QA, QATabViewProps } from '@/types';  // 共通の QA 型を利用
import { INFO_SOURCE_OPTIONS } from '@/components/ui/tagConfig';  // tagConfigから情報ソースのオプションをインポート

// モックの全 QA データ（複数企業のデータがある場合を想定）
const allMockQAItems: QA[] = [
  {
    qaId: "qa1",
    companyId: "1",
    title: "製品の特徴について",
    question: "この製品の特徴は何ですか？",
    answer: "最新のテクノロジーを活用しており、高い性能と信頼性を誇ります。",
    createdAt: "2025-01-15T08:00:00Z",
    fiscalPeriod: "2025-Q1",
    // タグをtagConfigから取得（例として最初と2番目のラベルを利用）
    tags: [INFO_SOURCE_OPTIONS[0].label, INFO_SOURCE_OPTIONS[1].label],
    genre: ["製品"],
    likeCount: 10,
    updatedAt: "2025-01-15T08:00:00Z",
    isPublished: true,
  },
  {
    qaId: "qa2",
    companyId: "1",
    title: "保証期間について",
    question: "保証期間はどのくらいですか？",
    answer: "購入から1年間保証付きです。",
    createdAt: "2025-02-10T09:30:00Z",
    fiscalPeriod: "2025-Q1",
    // タグをtagConfigから取得（例として3番目のラベルを利用）
    tags: [INFO_SOURCE_OPTIONS[2].label],
    genre: ["保証"],
    likeCount: 5,
    updatedAt: "2025-02-10T09:30:00Z",
    isPublished: true,
  },
  {
    qaId: "qa3",
    companyId: "2", // 他社の QA（このページでは表示されません）
    title: "サポート体制について",
    question: "サポートはどのように提供されますか？",
    answer: "24時間体制で対応しております。",
    createdAt: "2025-03-20T10:15:00Z",
    fiscalPeriod: "2025-Q1",
    // タグをtagConfigから取得（例として2番目のラベルを再利用）
    tags: [INFO_SOURCE_OPTIONS[1].label],
    genre: ["サポート"],
    likeCount: 8,
    updatedAt: "2025-03-20T10:15:00Z",
    isPublished: true,
  },
];

const QATabView: React.FC<QATabViewProps> = ({ companyId, companyName }) => {
  const [qaList, setQaList] = useState<QA[]>([]);
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);

  // 企業ID に紐づく QA のみを初期表示
  useEffect(() => {
    const companyQA = allMockQAItems.filter(qa => qa.companyId === companyId);
    setQaList(companyQA);
  }, [companyId]);

  // キーワード検索によるフィルタリング
  const handleSearch = (keyword: string) => {
    const filtered = allMockQAItems.filter(qa =>
      qa.companyId === companyId &&
      qa.question.includes(keyword)
    );
    setQaList(filtered);
  };

  // QA アイテムをクリックした際の処理
  const handleSelectQA = (qa: QA) => {
    setSelectedQA(qa);
  };

  // モーダルクローズ時の処理
  const handleCloseModal = () => {
    setSelectedQA(null);
  };

  // いいね操作用のハンドラ（プレースホルダー）
  const handleLike = (qaId: string) => {
    console.log(`QA ${qaId} liked.`);
  };

  // 日付フォーマット関数
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
  };

  // companyId が合致する場合は企業名を返す（QAResultList 用のユーティリティ）
  const getCompanyName = (id: string) => (id === companyId ? companyName : id);

  return (
    <div className="h-full overflow-y-auto">
      <QASearchBar onSearch={handleSearch} />
      <QAResultList
        qas={qaList}
        onItemClick={handleSelectQA}
        onLike={handleLike}
        getCompanyName={getCompanyName}
        formatDate={formatDate}
      />
      {selectedQA && (
        <QADetailModal
          qa={selectedQA}
          isOpen={true}
          onClose={handleCloseModal}
          role="investor"
          getCompanyName={getCompanyName}
        />
      )}
    </div>
  );
};

export default QATabView;
