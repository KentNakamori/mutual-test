// src/app/investor/qa/page.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import Sidebar from '@/components/common/sidebar';
import Footer from '@/components/common/footer';
import QASearchBar from '@/components/features/investor/qa/QASearchBar';
import QAResultList from '@/components/features/investor/qa/QAResultList';
import { QA, FilterType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { searchInvestorQa } from '@/libs/api';
import QaDetailModal from '@/components/ui/QaDetailModal'; // 共通コンポーネントのモーダルを使用

const QASearchPage: React.FC = () => {
  const menuItems = [
    { label: 'トップページ', link: '/investor/companies' },
    { label: "フォロー済み企業", link: "/investor/companies/followed" },
    { label: 'Q&A検索', link: '/investor/qa' },
    { label: 'チャットログ', link: '/investor/chat-logs' },
    { label: 'マイページ', link: '/investor/mypage' },
  ];

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filters, setFilters] = useState<FilterType>({});
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const { token } = useAuth();

  // モックデータ（バックエンド未接続時の代替）
  const mockQAData: QA[] = [
    {
      qaId: '1',
      title: '会社のミッション',
      question: '会社のミッションは何ですか？',
      answer: '当社のミッションは、革新を通じて最高のサービスを提供することです。',
      companyId: 'comp1',
      likeCount: 10,
      tags: ['ミッション', '企業理念'],
      genre: ['FAQ'],
      fiscalPeriod: '2025年度',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      isPublished: true,
    },
    {
      qaId: '2',
      title: 'サポートについて',
      question: 'カスタマーサポートはどのように対応していますか？',
      answer: '電話やメールなど、24時間365日対応のサポート体制を整えています。',
      companyId: 'comp2',
      likeCount: 5,
      tags: ['サポート'],
      genre: ['FAQ'],
      fiscalPeriod: '2025年度',
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2023-02-01T00:00:00Z',
      isPublished: true,
    }
  ];

  const { data, refetch, isLoading, error } = useQuery<{ results: QA[]; totalCount: number }>(
    ['investorQaSearch', searchKeyword, filters],
    () => {
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
    { enabled: !!token }
  );

  const qaItems: QA[] = data?.results || mockQAData;

  // 検索送信時のハンドラ
  const handleSearchSubmit = useCallback(
    (keyword: string, newFilters: FilterType) => {
      setSearchKeyword(keyword);
      setFilters(newFilters);
      refetch();
    },
    [refetch]
  );

  // QAResultList のアイテムクリック時に選択された QA を状態管理
  const handleItemClick = useCallback((qa: QA) => {
    setSelectedQA(qa);
  }, []);

  // モーダルを閉じるハンドラ
  const handleCloseModal = useCallback(() => {
    setSelectedQA(null);
  }, []);

  // いいね操作のハンドラ
  const handleLike = useCallback((qaId: string) => {
    console.log('いいね：', qaId);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          isCollapsible
          menuItems={menuItems}
          selectedItem="/investor/qa"
          onSelectMenuItem={(link) => (window.location.href = link)}
        />
        <main className="flex-1 container mx-auto p-4">
            {/* ページ上部の表題 */}
            <h1 className="text-2xl font-semibold mb-4">Q&A検索</h1>
          <QASearchBar onSearchSubmit={handleSearchSubmit} />
          {isLoading && <p>読み込み中…</p>}
          {error && <p>エラーが発生しました: {(error as Error).message}</p>}
          <QAResultList 
            qas={qaItems} 
            onItemClick={handleItemClick} 
            onLike={handleLike}
          />
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
        </main>
      </div>
      <Footer 
        footerLinks={[
          { label: '利用規約', href: '/terms' },
          { label: 'お問い合わせ', href: '/contact' }
        ]}
        copyrightText="株式会社サンプル"
      />
    </div>
  );
};

export default QASearchPage;
