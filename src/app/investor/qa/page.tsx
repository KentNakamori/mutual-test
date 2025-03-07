"use client";

import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import CommonHeader from '@/components/common/Header';
import CommonFooter from '@/components/common/Footer';
import QASearchBar from '@/components/features/investor/qa/QASearchBar';
import QAResultList from '@/components/features/investor/qa/QAResultList';
import QADetailModal from '@/components/features/investor/qa/QADetailModal';
import { QA, FilterType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { searchInvestorQa } from '@/libs/api';

/**
 * 投資家向け Q&A 検索ページ
 * ・検索キーワード、フィルター情報を管理し、API（またはモック）から Q&A 一覧を取得・表示します。
 */
const QASearchPage: React.FC = () => {
  // 検索キーワード、フィルター、モーダル表示対象 Q&A の状態管理
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filters, setFilters] = useState<FilterType>({});
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);

  // 認証情報（投資家用として想定）
  const { token } = useAuth();

  // バックエンド未接続時用のモックデータ
  const mockQAData: QA[] = [
    {
      qaId: '1',
      question: '会社のミッションは何ですか？',
      answer: '当社のミッションは、革新を通じて最高のサービスを提供することです。',
      companyId: 'comp1',
      likeCount: 10,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      isPublished: true,
    },
    {
      qaId: '2',
      question: 'カスタマーサポートはどのように対応していますか？',
      answer: '電話やメールなど、24時間365日対応のサポート体制を整えています。',
      companyId: 'comp2',
      likeCount: 5,
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2023-02-01T00:00:00Z',
      isPublished: true,
    }
  ];

  // React Query によるデータ取得
  const { data, refetch, isLoading, error } = useQuery<{ results: QA[]; totalCount: number }>(
    ['investorQaSearch', searchKeyword, filters],
    () => {
      // filters 内の各値を文字列に変換してクエリパラメータを組み立てる
      const query: Record<string, string> = {
        keyword: searchKeyword,
        ...(filters.likeMin !== undefined ? { likeMin: filters.likeMin.toString() } : {}),
        ...(filters.dateRange
          ? { dateFrom: filters.dateRange.from || '', dateTo: filters.dateRange.to || '' }
          : {}),
        ...(filters.sortKey ? { sortKey: filters.sortKey } : {}),
        ...(filters.sortDirection ? { sortDirection: filters.sortDirection } : {}),
      };
      return token
        ? searchInvestorQa(token, query)
        : Promise.resolve({ results: mockQAData, totalCount: mockQAData.length });
    },
    {
      enabled: !!token, // token が存在する場合のみ API 呼び出し
    }
  );

  const qaItems: QA[] = data?.results || mockQAData;

  // 検索バーからの検索パラメータ更新
  const handleSearchSubmit = useCallback(
    (keyword: string, newFilters: FilterType) => {
      setSearchKeyword(keyword);
      setFilters(newFilters);
      refetch();
    },
    [refetch]
  );

  // Q&A 項目クリックで詳細モーダルを表示
  const handleItemClick = useCallback((qa: QA) => {
    setSelectedQA(qa);
  }, []);

  // モーダルを閉じる
  const handleCloseModal = useCallback(() => {
    setSelectedQA(null);
  }, []);

  // いいね、ブックマーク操作のダミーハンドラ（実際は API 呼び出し処理を追加）
  const handleLike = useCallback((qaId: string) => {
    console.log('いいね：', qaId);
  }, []);

  const handleBookmark = useCallback((qaId: string) => {
    console.log('ブックマーク：', qaId);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <CommonHeader 
        navigationLinks={[
          { label: 'ホーム', href: '/' },
          { label: 'Q&A', href: '/investor/qa' }
        ]}
        userStatus={{ isLoggedIn: true, userName: '投資家ユーザー' }}
        onClickLogo={() => {}}
      />
      <main className="flex-1 container mx-auto p-4">
        <QASearchBar onSearchSubmit={handleSearchSubmit} />
        {isLoading && <p>読み込み中…</p>}
        {error && <p>エラーが発生しました: {(error as Error).message}</p>}
        <QAResultList 
          items={qaItems} 
          onItemClick={handleItemClick} 
          onLike={handleLike} 
          onBookmark={handleBookmark} 
        />
        {selectedQA && (
          <QADetailModal 
            qa={selectedQA} 
            onClose={handleCloseModal} 
            onLike={handleLike} 
            onBookmark={handleBookmark} 
          />
        )}
      </main>
      <CommonFooter 
        copyrightText="株式会社サンプル"
        footerLinks={[
          { label: '利用規約', href: '/terms' },
          { label: 'お問い合わせ', href: '/contact' }
        ]}
      />
    </div>
  );
};

export default QASearchPage;
