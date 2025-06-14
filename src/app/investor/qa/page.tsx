"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/common/sidebar';
import Footer from '@/components/common/footer';
import QASearchBar from '@/components/features/investor/qa/QASearchBar';
import QAResultList from '@/components/features/investor/qa/QAResultList';
import Pagination from '@/components/features/corporate/qa/Pagination';
import { QA, FilterType } from '@/types';
import { useUser } from "@auth0/nextjs-auth0";
import { searchInvestorQa } from '@/lib/api';
import QaDetailModal from '@/components/ui/QaDetailModal';
import { useQALike } from '@/hooks/useQA';
import GuestRestrictedContent from '@/components/features/investor/common/GuestRestrictedContent';
import { Home, Heart, Search, Logs, User } from 'lucide-react';

// 企業ID -> 企業名 を取得するマッピング用
function getCompanyName(companyId: string): string {
  const map: Record<string, string> = {
    comp1: 'テック・イノベーター株式会社',
    comp2: 'グリーンエナジー株式会社',
  };
  return map[companyId] || companyId;
}

const QASearchPage: React.FC = () => {
  const router = useRouter();
  const menuItems = [
    { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
    { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
    { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
    { label: 'チャットログ', link: '/investor/chat-logs', icon: <Logs size={20} /> },
    { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
  ];

  // Auth0 SDK v4 の認証状態
  const { user, error: userError, isLoading: userLoading } = useUser();
  
  // いいね機能のフック
  const { toggleLike, isLoading: likeLoading, error: likeError } = useQALike();

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filters, setFilters] = useState<FilterType>({});
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [qaItems, setQaItems] = useState<QA[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  
  // ゲスト判定
  const isGuest = !user && !userLoading;
  
  const itemsPerPage = 10;

  // 簡易な日付フォーマット関数
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}/${m}/${day}`;
  };

  // データ取得関数
  const fetchQaData = useCallback(async () => {
    if (userLoading) return;
    
    setIsLoading(true);
    
    try {
      const query: Record<string, any> = {
        keyword: searchKeyword,
        ...(filters.likeMin !== undefined ? { likeMin: filters.likeMin.toString() } : {}),
        ...(filters.dateRange
          ? { dateFrom: filters.dateRange.from || '', dateTo: filters.dateRange.to || '' }
          : {}),
        ...(filters.question_route ? { question_route: filters.question_route } : {}),
        ...(filters.category && filters.category.length > 0 ? { category: filters.category } : {}),
        ...(filters.fiscalPeriod && filters.fiscalPeriod.length > 0 ? { fiscalPeriod: filters.fiscalPeriod } : {}),
        ...(filters.sort ? { sort: filters.sort } : {}),
        ...(filters.order ? { order: filters.order } : {}),
        // 後方互換性のため、古いフィルター形式もサポート
        ...(filters.sortKey ? { sortKey: filters.sortKey } : {}),
        ...(filters.sortDirection ? { sortDirection: filters.sortDirection } : {}),
        page: currentPage,
        limit: itemsPerPage
      };
      
      // Auth0 SDK v4 対応: token は渡さず、プロキシ経由で JWT を送信
      const response = await searchInvestorQa(query, undefined);
      setQaItems(response.results);
      setTotalCount(response.totalCount);
      setError(null);
    } catch (err) {
      console.error('QAデータ取得エラー:', err);
      setError(err instanceof Error ? err : new Error('QAデータの取得に失敗しました'));
      setQaItems([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchKeyword, filters, currentPage, itemsPerPage, userLoading]);

  // 初回データ取得と条件変更時のデータ再取得
  useEffect(() => {
    // ゲストユーザーでもデータを取得
    if (!userLoading) {
      fetchQaData();
    }
  }, [fetchQaData, userLoading]);

  // ページネーション計算
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  // 検索送信時のハンドラ
  const handleSearchSubmit = useCallback(
    (keyword: string, newFilters: FilterType) => {
      setSearchKeyword(keyword);
      setFilters(newFilters);
      // ページを初期状態に戻す
      setCurrentPage(1);
    },
    []
  );

  // アイテムをクリックしたら選択状態にしてモーダルを開く
  const handleItemClick = useCallback((qa: QA) => {
    setSelectedQA(qa);
  }, []);

  // モーダルを閉じる
  const handleCloseModal = useCallback(() => {
    setSelectedQA(null);
  }, []);

  // いいね操作
  const handleLike = useCallback(async (qaId: string) => {
    // ゲストユーザーの場合はポップアップを表示
    if (isGuest) {
      setShowGuestPopup(true);
      return;
    }

    // 認証済みユーザーの場合の処理
    if (!user) {
      const returnTo = typeof window !== 'undefined' ? window.location.pathname : '/investor/qa';
      router.push(`/api/auth/investor-login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }

    try {
      console.log('いいね操作開始:', qaId);
      
      // 現在のQAアイテムを取得してisLikedの状態を確認
      const currentQA = qaItems.find(qa => qa.qaId === qaId);
      if (!currentQA) {
        console.error('QAアイテムが見つかりません:', qaId);
        return;
      }
      
      // いいね状態をトグル
      const result = await toggleLike(qaId, currentQA.isLiked || false);
      console.log('いいね操作結果:', result);
      
      // ローカル状態を更新
      setQaItems(prevItems =>
        prevItems.map(qa =>
          qa.qaId === qaId
            ? {
                ...qa,
                likeCount: result.likeCount,
                isLiked: result.isLiked
              }
            : qa
        )
      );
      
      // 選択されたQAも更新
      if (selectedQA && selectedQA.qaId === qaId) {
        setSelectedQA({
          ...selectedQA,
          likeCount: result.likeCount,
          isLiked: result.isLiked
        });
      }
      
    } catch (error) {
      console.error('いいね操作エラー:', error);
      setError(error instanceof Error ? error : new Error('いいね操作に失敗しました'));
    }
  }, [qaItems, selectedQA, toggleLike, isGuest, user, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          isCollapsible
          menuItems={menuItems}
          selectedItem="/investor/qa"
          onSelectMenuItem={(link) => router.push(link)}
        />
        <main className="flex-1 container mx-auto p-4">
          {/* ページ上部の表題 */}
          <h1 className="text-2xl font-semibold mb-4">Q&A検索</h1>

          <QASearchBar 
            onSearchSubmit={handleSearchSubmit}
            onSortChange={(sortValue: string) => {
              // sortValue は "createdAt_desc" などの形式で渡される
              const [sortKey, sortDirection] = sortValue.split('_');
              // filters を更新して新しい検索を実行する
              const updatedFilters = { 
                ...filters, 
                sort: sortKey as 'createdAt' | 'likeCount',
                order: sortDirection as 'asc' | 'desc',
                // 後方互換性のため、古いフィルター形式も設定
                sortKey, 
                sortDirection: sortDirection as 'asc' | 'desc' 
              };
              setFilters(updatedFilters);
              setCurrentPage(1);
            }}
            initialKeyword={searchKeyword}
            initialFilters={filters}
          />

          {isLoading && <p className="text-center py-4">読み込み中…</p>}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 mb-4">
              <p>エラーが発生しました: {error.message}</p>
              <button 
                onClick={() => fetchQaData()} 
                className="mt-2 px-4 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
              >
                再試行
              </button>
            </div>
          )}
          
          {likeError && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-700 mb-4">
              <p>いいね操作でエラーが発生しました</p>
            </div>
          )}

          {/* QAResultList：1列表示（縦方向にリストアップ） */}
          {!isLoading && !error && (
            <QAResultList
              qas={qaItems}
              onItemClick={handleItemClick}
              onLike={handleLike}
              getCompanyName={getCompanyName}
              formatDate={formatDate}
            />
          )}

          {/* Pagination コンポーネント */}
          {totalPages > 1 && !isLoading && !error && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChangePage={setCurrentPage}
            />
          )}

          {/* selectedQA が存在する場合にモーダルを表示 */}
          {selectedQA && (
            <QaDetailModal
              qa={selectedQA}
              role="investor"
              isOpen={true}
              onClose={handleCloseModal}
              onLike={handleLike}
            />
          )}

          {/* ゲスト制限ポップアップ */}
          {showGuestPopup && (
            <GuestRestrictedContent 
              featureName="ブックマーク" 
              isPopup={true}
              onClose={() => setShowGuestPopup(false)}
            />
          )}
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: '利用規約', href: '/terms' },
          { label: 'お問い合わせ', href: '/contact' },
        ]}
        copyrightText="株式会社サンプル"
        onSelectLink={(href) => router.push(href)}
      />
    </div>
  );
};
  
export default QASearchPage;