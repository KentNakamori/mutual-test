import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import QASearchBar from './QASearchBar';
import QAResultList from '@/components/features/investor/qa/QAResultList';
import QADetailModal from '@/components/ui/QaDetailModal';
import { QA, QATabViewProps, FilterType } from '@/types';

const QATabView: React.FC<QATabViewProps> = ({ companyId, companyName }) => {
  const [qaList, setQaList] = useState<QA[]>([]);
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filters, setFilters] = useState<FilterType>({});
  const { user, isLoading: authLoading } = useUser();

  // 企業固有のQA検索API呼び出し関数
  const fetchCompanyQAs = useCallback(async (
    keyword?: string, 
    searchFilters?: FilterType
  ) => {
    if (authLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`QATabView: Fetching QAs for company ${companyId} with keyword: "${keyword}"`);
      console.log('QATabView: Filters:', searchFilters);
      
      // URLSearchParamsを使用してクエリパラメータを構築
      const queryParams = new URLSearchParams();
      
      // キーワード
      if (keyword) {
        queryParams.append('keyword', keyword);
      }
      
      // フィルターの処理
      if (searchFilters) {
        // 質問ルート
        if (searchFilters.question_route) {
          queryParams.append('question_route', searchFilters.question_route);
        }
        
        // カテゴリ（配列）
        if (searchFilters.category && Array.isArray(searchFilters.category)) {
          searchFilters.category.forEach((g) => {
            if (g) queryParams.append('category', g);
          });
        }
        
        // 決算期
        if (searchFilters.fiscalPeriod) {
          if (Array.isArray(searchFilters.fiscalPeriod)) {
            searchFilters.fiscalPeriod.forEach((period) => {
              if (period) queryParams.append('fiscalPeriod', period);
            });
          } else {
            queryParams.append('fiscalPeriod', searchFilters.fiscalPeriod);
          }
        }
        
        // ブックマークフィルター
        if (searchFilters.isBookmarked !== undefined) {
          queryParams.append('isBookmarked', searchFilters.isBookmarked.toString());
        }
        
        // ソート
        if (searchFilters.sort) {
          queryParams.append('sort', searchFilters.sort);
        }
        
        // ソート順序
        if (searchFilters.order) {
          queryParams.append('order', searchFilters.order);
        }
      }
      
      // デフォルトソートを設定（フィルターで指定されていない場合）
      if (!queryParams.has('sort')) {
        queryParams.append('sort', 'createdAt');
      }
      if (!queryParams.has('order')) {
        queryParams.append('order', 'desc');
      }
      
      // ページネーション（企業ページでは現在未使用だが、将来的に追加可能）
      queryParams.append('page', '1');
      queryParams.append('limit', '100'); // 企業ページでは多めに取得
      
      console.log(`QATabView: Query params: ${queryParams.toString()}`);
      
      // 企業固有のAPI endpointを使用
      const response = await fetch(`/api/proxy/investor/qa/search/company/${companyId}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }
      
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
      setError(error instanceof Error ? error.message : 'QAの取得に失敗しました');
      setQaList([]);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, authLoading]);

  // 初回データ取得（フィルターなし）
  useEffect(() => {
    if (!authLoading) {
      fetchCompanyQAs();
    }
  }, [fetchCompanyQAs, authLoading]);

  // 検索・フィルタリング処理
  const handleSearch = useCallback((keyword: string, newFilters: FilterType) => {
    console.log('QATabView: Search triggered with keyword:', keyword, 'filters:', newFilters);
    setSearchKeyword(keyword);
    setFilters(newFilters);
    fetchCompanyQAs(keyword, newFilters);
  }, [fetchCompanyQAs]);

  // ソート変更処理
  const handleSortChange = useCallback((sortValue: string) => {
    console.log('QATabView: Sort changed to:', sortValue);
    const [sortKey, sortDirection] = sortValue.split('_');
    const updatedFilters = { 
      ...filters, 
      sort: sortKey as 'createdAt' | 'likeCount',
      order: sortDirection as 'asc' | 'desc'
    };
    setFilters(updatedFilters);
    fetchCompanyQAs(searchKeyword, updatedFilters);
  }, [filters, searchKeyword, fetchCompanyQAs]);

  // QAアイテムをクリックした際の処理
  const handleSelectQA = useCallback((qa: QA) => {
    console.log('QATabView: Selected QA:', qa);
    setSelectedQA(qa);
  }, []);

  // モーダルクローズ時の処理
  const handleCloseModal = useCallback(() => {
    console.log('QATabView: Closing QA detail modal');
    setSelectedQA(null);
  }, []);

  // ブックマーク操作用のハンドラ
  const handleLike = useCallback(async (qaId: string) => {
    console.log(`QATabView: Starting bookmark operation for QA ${qaId}`);
    
    try {
      // 現在のQAを見つけてブックマーク状態を確認
      const currentQA = qaList.find(qa => qa.qaId === qaId) || selectedQA;
      const isCurrentlyBookmarked = currentQA?.isLiked || false;
      
      console.log(`QATabView: Current bookmark state for QA ${qaId}:`, {
        isLiked: isCurrentlyBookmarked,
        likeCount: currentQA?.likeCount,
        qaExists: !!currentQA
      });
      
      // 正しいAPIエンドポイントを使用
      const endpoint = `/api/proxy/investor/qa/${qaId}/like`;
      const action = isCurrentlyBookmarked ? 'remove' : 'add';
      const payload = { action };
      
      console.log(`QATabView: Making request to ${endpoint} with payload:`, payload);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      console.log(`QATabView: Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`QATabView: Error response body:`, errorText);
        throw new Error(`HTTPエラー: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('QATabView: Like API Response:', data);
      
      // レスポンスからブックマーク状態を更新
      if (data.likeCount !== undefined && data.isLiked !== undefined) {
        console.log(`QATabView: Successfully updated bookmark for QA ${qaId}`);
        console.log(`QATabView: New state - bookmark: ${data.isLiked}, count: ${data.likeCount}`);
        
        setQaList(prevList =>
          prevList.map(qa =>
            qa.qaId === qaId ? { 
              ...qa, 
              likeCount: data.likeCount,
              isLiked: data.isLiked
            } : qa
          )
        );
        
        if (selectedQA && selectedQA.qaId === qaId) {
          setSelectedQA({
            ...selectedQA,
            likeCount: data.likeCount,
            isLiked: data.isLiked
          });
        }
      } else {
        console.warn('QATabView: Unexpected API response format:', data);
        // フォールバック: ローカル状態のみ更新
        const newBookmarkStatus = !isCurrentlyBookmarked;
        const newLikeCount = Math.max(0, (currentQA?.likeCount || 0) + (newBookmarkStatus ? 1 : -1));
        
        console.log(`QATabView: Fallback state - bookmark: ${newBookmarkStatus}, count: ${newLikeCount}`);
        
        setQaList(prevList =>
          prevList.map(qa =>
            qa.qaId === qaId ? { 
              ...qa, 
              likeCount: newLikeCount,
              isLiked: newBookmarkStatus
            } : qa
          )
        );
        
        if (selectedQA && selectedQA.qaId === qaId) {
          setSelectedQA({
            ...selectedQA,
            likeCount: newLikeCount,
            isLiked: newBookmarkStatus
          });
        }
      }
      
      console.log(`QATabView: Bookmark operation completed successfully for QA ${qaId}`);
      
    } catch (error) {
      console.error('QATabView: ブックマークの更新に失敗しました:', error);
      console.error('QATabView: Error details:', {
        qaId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // エラーメッセージをより詳細に
      let errorMessage = 'ブックマークの更新に失敗しました';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage += ': ネットワーク接続をご確認ください';
        } else if (error.message.includes('401')) {
          errorMessage += ': 認証が必要です。ログインしてください';
        } else if (error.message.includes('403')) {
          errorMessage += ': アクセス権限がありません';
        } else {
          errorMessage += `: ${error.message}`;
        }
      }
      
      setError(errorMessage);
    }
  }, [qaList, selectedQA]);

  // 日付フォーマット関数
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <QASearchBar 
        onSearchSubmit={handleSearch}
        onSortChange={handleSortChange}
        initialKeyword={searchKeyword}
        initialFilters={filters}
      />
      
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">エラーが発生しました</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <button 
                onClick={() => setError(null)} 
                className="px-3 py-1 bg-red-200 text-red-800 rounded-md text-sm hover:bg-red-300 transition-colors"
              >
                閉じる
              </button>
              <button 
                onClick={() => fetchCompanyQAs(searchKeyword, filters)} 
                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
              >
                再試行
              </button>
            </div>
          </div>
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
