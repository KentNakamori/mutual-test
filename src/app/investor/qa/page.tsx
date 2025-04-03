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
    { label: 'Q&A', link: '/investor/qa' },
    { label: 'チャットログ', link: '/investor/chat-logs' },
    { label: 'マイページ', link: '/investor/mypage' },
  ];

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filters, setFilters] = useState<FilterType>({});
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const { token } = useAuth();

  const mockQAData: QA[] = [
    {
      qaId: '1',
      question: '会社のミッションは何ですか？',
      answer: '当社のミッションは、革新を通じて最高のサービスを提供することです。',
      companyId: 'comp1',
      likeCount: 10,
      views: 100,
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
      views: 100,
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

  const handleSearchSubmit = useCallback(
    (keyword: string, newFilters: FilterType) => {
      setSearchKeyword(keyword);
      setFilters(newFilters);
      refetch();
    },
    [refetch]
  );

  const handleItemClick = useCallback((qa: QA) => {
    setSelectedQA(qa);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedQA(null);
  }, []);

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
          <QASearchBar onSearchSubmit={handleSearchSubmit} />
          {isLoading && <p>読み込み中…</p>}
          {error ? <p>エラーが発生しました: {(error as Error).message}</p> : null}

          <QAResultList 
            items={qaItems} 
            onItemClick={handleItemClick} 
            onLike={handleLike}
            onBookmark={() => {}}
          />
          {selectedQA && (
            <QaDetailModal 
              qa={{
                id: selectedQA.qaId,
                title: selectedQA.question,
                question: selectedQA.question,
                answer: selectedQA.answer,
                createdAt: selectedQA.createdAt,
                views: selectedQA.views,
                likeCount: selectedQA.likeCount,
                tags: selectedQA.tags || [],
                genreTags: selectedQA.genreTags || [],
                updatedAt: selectedQA.updatedAt,
              }}
              role="investor"
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
