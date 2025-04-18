import React, { useState, useEffect } from 'react';
import QASearchBar from './QASearchBar';
import QAResultList from '@/components/features/investor/qa/QAResultList';
import QADetailModal from '@/components/ui/QaDetailModal';
import { QA, QATabViewProps } from '@/types';

const QATabView: React.FC<QATabViewProps> = ({ companyId, companyName }) => {
  const [qaList, setQaList] = useState<QA[]>([]);
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);

  // 企業IDに紐づくQAを取得
  useEffect(() => {
    const fetchQAs = async () => {
      try {
        const response = await fetch(`/api/investor/qa/search/company/${companyId}`);
        const data = await response.json();
        setQaList(data.items);
      } catch (error) {
        console.error('QAの取得に失敗しました:', error);
      }
    };

    fetchQAs();
  }, [companyId]);

  // キーワード検索によるフィルタリング
  const handleSearch = async (keyword: string, filters: Record<string, any>) => {
    try {
      const queryParams = new URLSearchParams({
        keyword,
        ...filters,
        companyId
      });
      const response = await fetch(`/api/investor/qa/search?${queryParams}`);
      const data = await response.json();
      setQaList(data.items);
    } catch (error) {
      console.error('QAの検索に失敗しました:', error);
    }
  };

  // QAアイテムをクリックした際の処理
  const handleSelectQA = (qa: QA) => {
    setSelectedQA(qa);
  };

  // モーダルクローズ時の処理
  const handleCloseModal = () => {
    setSelectedQA(null);
  };

  // いいね操作用のハンドラ
  const handleLike = async (qaId: string) => {
    try {
      const response = await fetch(`/api/investor/qa/${qaId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        // いいね数が更新されたQAをリストに反映
        setQaList(prevList =>
          prevList.map(qa =>
            qa._id === qaId ? { ...qa, likeCount: data.likeCount } : qa
          )
        );
      }
    } catch (error) {
      console.error('いいねの更新に失敗しました:', error);
    }
  };

  // 日付フォーマット関数
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full overflow-y-auto">
      <QASearchBar onSearchSubmit={handleSearch} />
      <QAResultList
        qas={qaList}
        onItemClick={handleSelectQA}
        onLike={handleLike}
        getCompanyName={() => companyName}
        formatDate={formatDate}
      />
      {selectedQA && (
        <QADetailModal
          qa={selectedQA}
          isOpen={true}
          onClose={handleCloseModal}
          role="investor"
          onLike={handleLike}
        />
      )}
    </div>
  );
};

export default QATabView;
