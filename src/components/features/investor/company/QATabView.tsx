import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import QASearchBar from './QASearchBar';
import QAResultList from '@/components/features/investor/qa/QAResultList';
import QADetailModal from '@/components/ui/QaDetailModal';
import { QA, QATabViewProps } from '@/types';

const QATabView: React.FC<QATabViewProps> = ({ companyId, companyName }) => {
  const [qaList, setQaList] = useState<QA[]>([]);
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useUser();

  // 企業IDに紐づくQAを取得（プロキシ経由でJWTを送信）
  useEffect(() => {
    const fetchQAs = async () => {
      if (authLoading) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`QATabView: Fetching QAs for company ${companyId}`);
        // Auth0 SDK v4ではトークンはプロキシ側で取得される
        const response = await fetch(`/api/proxy/investor/qa/search/company/${companyId}`);
        const data = await response.json();
        
        console.log('QATabView: API Response:', data);
        
        // APIレスポンスの構造を確認
        if (data.results) {
          console.log(`QATabView: Found ${data.results.length} QAs in results`);
          setQaList(data.results);
        } else if (data.items) {
          console.log(`QATabView: Found ${data.items.length} QAs in items`);
          setQaList(data.items);
        } else {
          console.error('QATabView: Unexpected API response structure:', data);
          setError('予期しないAPIレスポンス形式です');
          setQaList([]);
        }
      } catch (error) {
        console.error('QATabView: QAの取得に失敗しました:', error);
        setError('QAの取得に失敗しました');
        setQaList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQAs();
  }, [companyId, authLoading]);

  // キーワード検索によるフィルタリング
  const handleSearch = async (keyword: string, filters: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`QATabView: Searching with keyword "${keyword}" and filters:`, filters);
      
      // URLSearchParamsは配列を直接サポートしていないため、カスタム処理が必要
      const queryParams = new URLSearchParams();
      
      // 基本パラメータを追加
      if (keyword) queryParams.append('keyword', keyword);
      if (companyId) queryParams.append('companyId', companyId);
      
      // filtersの処理
      Object.entries(filters).forEach(([key, value]) => {
        // 配列の場合（ genreなど）
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item) queryParams.append(key, item);
          });
        } 
        // 単一値の場合
        else if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      console.log(`QATabView: Search query params: ${queryParams.toString()}`);
      
      // Auth0 SDK v4ではトークンはプロキシ側で取得される
      const response = await fetch(`/api/proxy/investor/qa/search?${queryParams}`);
      const data = await response.json();
      
      console.log('QATabView: Search API Response:', data);
      
      // APIレスポンスの構造を確認
      if (data.results) {
        console.log(`QATabView: Found ${data.results.length} QAs in search results`);
        setQaList(data.results);
      } else if (data.items) {
        console.log(`QATabView: Found ${data.items.length} QAs in search items`);
        setQaList(data.items);
      } else {
        console.error('QATabView: Unexpected search API response structure:', data);
        setError('予期しない検索APIレスポンス形式です');
        setQaList([]);
      }
    } catch (error) {
      console.error('QATabView: QAの検索に失敗しました:', error);
      setError('QAの検索に失敗しました');
      setQaList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // QAアイテムをクリックした際の処理
  const handleSelectQA = (qa: QA) => {
    console.log('QATabView: Selected QA:', qa);
    setSelectedQA(qa);
  };

  // モーダルクローズ時の処理
  const handleCloseModal = () => {
    console.log('QATabView: Closing QA detail modal');
    setSelectedQA(null);
  };

  // いいね操作用のハンドラ
  const handleLike = async (qaId: string) => {
    try {
      console.log(`QATabView: Liking QA ${qaId}`);
      
      // Auth0 SDK v4ではトークンはプロキシ側で取得される
      const response = await fetch(`/api/proxy/investor/qa/${qaId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('QATabView: Like API Response:', data);
      
      if (data.success) {
        console.log(`QATabView: Successfully liked QA ${qaId}, new like count: ${data.likeCount}`);
        // いいね数が更新されたQAをリストに反映
        setQaList(prevList =>
          prevList.map(qa =>
            qa.qaId === qaId ? { ...qa, likeCount: data.likeCount } : qa
          )
        );
      } else {
        console.error('QATabView: Like operation failed:', data);
      }
    } catch (error) {
      console.error('QATabView: いいねの更新に失敗しました:', error);
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
    <div className="h-full overflow-y-auto p-4">
      <QASearchBar onSearchSubmit={handleSearch} />
      
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* ローディング表示 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <QAResultList
          qas={qaList}
          onItemClick={handleSelectQA}
          onLike={handleLike}
          getCompanyName={() => companyName}
          formatDate={formatDate}
        />
      )}
      
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
