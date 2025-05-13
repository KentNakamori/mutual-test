"use client";

import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import Sidebar from '@/components/common/sidebar';
import Footer from '@/components/common/footer';
import QASearchBar from '@/components/features/investor/qa/QASearchBar';
import QAResultList from '@/components/features/investor/qa/QAResultList';
import Pagination from '@/components/features/corporate/qa/Pagination';
import { QA, FilterType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { searchInvestorQa } from '@/lib/api';
import QaDetailModal from '@/components/ui/QaDetailModal';
import { Home, Heart, Search, MessageSquare, User } from 'lucide-react';

// 企業ID -> 企業名 を取得するマッピング用
function getCompanyName(companyId: string): string {
  const map: Record<string, string> = {
    comp1: 'テック・イノベーター株式会社',
    comp2: 'グリーンエナジー株式会社',
  };
  return map[companyId] || companyId;
}

const QASearchPage: React.FC = () => {
  const menuItems = [
    { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
    { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
    { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
    { label: 'チャットログ', link: '/investor/chat-logs', icon: <MessageSquare size={20} /> },
    { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
  ];

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filters, setFilters] = useState<FilterType>({});
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const { token } = useAuth();

  // 簡易な日付フォーマット関数
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}/${m}/${day}`;
  };

  // モックデータ（バックエンド未接続時の代替）
  const mockQAData: QA[] = [
    {
      qaId: '1',
      title: '2025年度の業績見通しについて',
      question: '今期の業績見通しを教えてください。',
      answer:
        '当社では、既存事業の拡大と新規事業への投資を通じて業績の拡大を目指しており、現在の見通しでは前年比20%の成長を計画しております。新規事業ではAIを活用したサービス展開を視野に入れています。詳細は決算説明資料をご参照ください。',
      companyId: 'comp1',
      likeCount: 15,
      tags: ['決算説明会'],
      genre: ['業績'],
      fiscalPeriod: '2025年度 Q4',
      createdAt: '2023-09-01T00:00:00Z',
      updatedAt: '2023-09-01T00:00:00Z',
      isPublished: true,
    },
    {
      qaId: '2',
      title: '人材戦略について',
      question: '優秀な人材を確保するためにどのような施策を行いますか？',
      answer:
        '当社はリファラル採用の強化や従業員エンゲージメントの向上を図るための福利厚生拡充など、多角的なアプローチをしています。具体的には、研修制度の充実やキャリアアップ支援などを行い、労働環境の改善にも注力しています。',
      companyId: 'comp2',
      likeCount: 8,
      tags: ['決算説明動画'],
      genre: ['人材戦略'],
      fiscalPeriod: '2025年度 Q2',
      createdAt: '2023-10-01T00:00:00Z',
      updatedAt: '2023-10-01T00:00:00Z',
      isPublished: true,
    },
    // モックデータがさらに必要なら、ここに追加してください。
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
      if (token) {
        return searchInvestorQa(token, query);
      } else {
        // mock データに対して fiscalPeriod と genre でフィルタリング
        let filtered = mockQAData.filter(qa => {
          let pass = true;
          if (filters.fiscalPeriod && filters.fiscalPeriod !== '') {
            // filters.fiscalPeriod の例: "2025-Q4" を "2025年度 Q4" に変換
            const filterFiscal = filters.fiscalPeriod.replace('-', '年度 ');
            pass = pass && qa.fiscalPeriod === filterFiscal;
          }
          if (filters.genre && filters.genre !== '') {
            // QA.genre は配列と仮定
            pass = pass && qa.genre.includes(filters.genre);
          }
          return pass;
        });
  
        // 並び替え処理：sortKey と sortDirection が指定されている場合にソートを実施
        if (filters.sortKey && filters.sortDirection) {
          filtered.sort((a, b) => {
            if (filters.sortKey === 'createdAt') {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              return filters.sortDirection === 'desc'
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
            } else if (filters.sortKey === 'likeCount') {
              return filters.sortDirection === 'desc'
                ? b.likeCount - a.likeCount
                : a.likeCount - b.likeCount;
            }
            return 0;
          });
        }
  
        return Promise.resolve({ results: filtered, totalCount: filtered.length });
      }
    },
    { enabled: !!token }
  );
  

  // 全QAデータ
  const qaItems: QA[] = data?.results || mockQAData;

  // ページネーション計算
  const totalPages = Math.ceil(qaItems.length / itemsPerPage);
  // 現在のページに表示するアイテム
  const displayedItems = qaItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 検索送信時のハンドラ
  const handleSearchSubmit = useCallback(
    (keyword: string, newFilters: FilterType) => {
      setSearchKeyword(keyword);
      setFilters(newFilters);
      // ページを初期状態に戻す
      setCurrentPage(1);
      refetch();
    },
    [refetch]
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

          <QASearchBar 
            onSearchSubmit={handleSearchSubmit}
            onSortChange={(sortValue: string) => {
            // sortValue は "createdAt_desc" などの形式で渡される
              const [sortKey, sortDirection] = sortValue.split('_');
            // filters を更新して新しい検索を実行する
              const updatedFilters = { ...filters, sortKey, sortDirection };
              setFilters(updatedFilters);
              setCurrentPage(1);
              refetch();
            }}
            initialKeyword={searchKeyword}
            initialFilters={filters}
          />

          {isLoading && <p>読み込み中…</p>}
          {error && <p>エラーが発生しました: {(error as Error).message}</p>}

          {/* QAResultList：1列表示（縦方向にリストアップ） */}
          <QAResultList
            qas={displayedItems}
            onItemClick={handleItemClick}
            onLike={handleLike}
            getCompanyName={getCompanyName}
            formatDate={formatDate}
          />

          {/* Pagination コンポーネント */}
          {totalPages > 1 && (
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
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: '利用規約', href: '/terms' },
          { label: 'お問い合わせ', href: '/contact' },
        ]}
        copyrightText="株式会社サンプル"
        />
      </div>
    );
  };
  
  export default QASearchPage;