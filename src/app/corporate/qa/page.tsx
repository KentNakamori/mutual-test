// src/app/corporate/qa/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";
import TopActionBar from "@/components/features/corporate/qa/TopActionBar";
import QaListCards from "@/components/features/corporate/qa/QaListCards";
import UploadModal from "@/components/features/corporate/qa/UploadModal";
import QaDetailModal from "@/components/ui/QaDetailModal";
import { QA } from "@/types";
import { LayoutDashboard, HelpCircle, MessageSquare, Settings } from 'lucide-react';
import { searchCorporateQa, createCorporateQa, updateCorporateQa, deleteCorporateQa } from "@/lib/api";
import { useUser } from "@auth0/nextjs-auth0";


const sidebarMenuItems = [
  { label: "ダッシュボード", link: "/corporate/dashboard", icon: <LayoutDashboard size={20} />},
  { label: "Q&A管理", link: "/corporate/qa", icon: <HelpCircle size={20} /> },
  { label: "IRチャット", link: "/corporate/irchat" , icon: <MessageSquare size={20} />},
  { label: "設定", link: "/corporate/settings", icon: <Settings size={20} />  },
];

const QaPage: React.FC = () => {
  const router = useRouter();
  /*auth0*/
  const { user, isLoading: userLoading, error: userError } = useUser();
  const isAuthenticated = !!user;            // ← 旧 useAuth の isAuthenticated 相当
  const token = user?.sub ?? null;
  
  
  const [qas, setQas] = useState<QA[]>([]);
  const [selectedQa, setSelectedQa] = useState<QA | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState<{
    keyword: string;
    genre: string[];
    source: string[];
    tag?: string;
    fiscalPeriod?: string[];
    sort: 'createdAt' | 'likeCount';
    order: 'asc' | 'desc';
    page: number;
    limit: number;
    review_status?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
  }>({
    keyword: '',
    genre: [],
    source: [],
    sort: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    const fetchQAs = async () => {
      if (!token || !isAuthenticated) return;
      
      try {
        setIsLoading(true);
        
        // APIパラメータをバックエンドの期待する形式に変換
        const apiParams = {
          keyword: searchParams.keyword || undefined,
          genre: searchParams.genre?.length > 0 ? searchParams.genre : undefined,
          fiscalPeriod: searchParams.fiscalPeriod && searchParams.fiscalPeriod.length > 0 
            ? searchParams.fiscalPeriod 
            : undefined,
          tag: searchParams.tag || undefined,
          sort: searchParams.sort || 'createdAt',
          order: searchParams.order || 'desc',
          page: searchParams.page || 1,
          limit: searchParams.limit || 10,
          review_status: searchParams.review_status
        };
        
        console.log('=== APIリクエスト直前のパラメータ（完全版） ===');
        console.log('検索パラメータ:', {
          ...apiParams,
          genre: Array.isArray(apiParams.genre) ? apiParams.genre : undefined,
          fiscalPeriod: Array.isArray(apiParams.fiscalPeriod) ? apiParams.fiscalPeriod : undefined
        });
        console.log('=== APIリクエスト直前のパラメータ ===');
        
        const response = await searchCorporateQa(token, apiParams);
        console.log("取得したQAデータ:", response);
        setQas(response.results);
        setTotalCount(response.totalCount);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error("QAデータの取得に失敗しました:", err);
        setError("QAデータの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQAs();
  }, [
    token, 
    isAuthenticated, 
    searchParams.keyword, 
    searchParams.genre, 
    searchParams.tag, 
    searchParams.fiscalPeriod, 
    searchParams.sort, 
    searchParams.order, 
    searchParams.page, 
    searchParams.limit,
    searchParams.review_status
  ]);

  const handleSearch = useCallback((params: { 
    query: string; 
    genre?: string[]; 
    tags?: string[];
    fiscalPeriod?: string[];
    sort?: 'createdAt' | 'likeCount';
    order?: 'asc' | 'desc';
    reviewStatus?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
  }) => {
    console.log("検索パラメータを受信:", params);
    
    setSearchParams(prev => ({
      ...prev,
      keyword: params.query || '',
      genre: params.genre || [],
      tag: params.tags?.[0] || undefined, // タグは単一値として渡す
      fiscalPeriod: params.fiscalPeriod || undefined,
      sort: params.sort || 'createdAt',
      order: params.order || 'desc',
      page: 1, // 検索時は1ページ目に戻る
      review_status: params.reviewStatus
    }));
  }, []);

  const handleFilterChange = useCallback((newFilters: {
    tag?: string;
    genre?: string[];
    fiscalPeriod?: string[];
    sort?: 'createdAt' | 'likeCount';
    order?: 'asc' | 'desc';
    reviewStatus?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
    page?: number;
    limit?: number;
  }) => {
    console.log("フィルター変更:", newFilters);
    
    setSearchParams(prev => {
      // 新しいフィルター設定
      const updated = {
        ...prev,
        tag: newFilters.tag || undefined,
        genre: newFilters.genre || [],
        fiscalPeriod: newFilters.fiscalPeriod || undefined,
        page: newFilters.page || 1,
        limit: newFilters.limit || prev.limit,
        review_status: newFilters.reviewStatus || undefined
      };
      
      // sortとorderを個別に処理
      if (newFilters.sort && ['createdAt', 'likeCount'].includes(newFilters.sort)) {
        updated.sort = newFilters.sort as 'createdAt' | 'likeCount';
      }
      
      if (newFilters.order && ['asc', 'desc'].includes(newFilters.order)) {
        updated.order = newFilters.order as 'asc' | 'desc';
      }
      
      return updated;
    });
  }, []);

  const handleStatusChange = useCallback((status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'all') => {
    setSearchParams(prev => ({
      ...prev,
      review_status: status === 'all' ? undefined : status,
      page: 1
    }));
  }, []);

  const handleSortChange = useCallback((sort: string, order: 'asc' | 'desc') => {
    setSearchParams(prev => ({
      ...prev,
      sort: sort as 'createdAt' | 'likeCount',
      order: order,
      page: 1 // ソート変更時は1ページ目に戻る
    }));
  }, []);

  const handleFiscalPeriodChange = useCallback((period: string) => {
    setSearchParams(prev => ({
      ...prev,
      fiscalPeriod: period ? [period] : undefined, // 必ず配列として渡す
      page: 1
    }));
  }, []);

  // QAカードクリック時のハンドラ
  const handleSelectQA = (qaId: string) => {
    const qa = qas.find((item) => item.qaId === qaId) || null;
    setSelectedQa(qa);
  };

  const handleDeleteQa = async (qaId: string) => {
    if (!token || !isAuthenticated) return;

    try {
      await deleteCorporateQa(token, qaId);
      // 削除後に検索を再実行
      const response = await searchCorporateQa(token, searchParams);
      setQas(response.results);
      setSelectedQa(null); // 選択中のQAをクリア
    } catch (err) {
      console.error("QAの削除に失敗しました:", err);
      setError("QAの削除に失敗しました");
    }
  };

  const handleOpenUploadModal = () => setIsUploadModalOpen(true);
  const handleCloseUploadModal = () => setIsUploadModalOpen(false);
  const handleConfirmUpload = (newQas: QA[]) => {
    setQas((prev) => [...newQas, ...prev]);
    handleCloseUploadModal();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          menuItems={sidebarMenuItems}
          isCollapsible
          selectedItem="/corporate/qa"
          onSelectMenuItem={(link: string) => router.push(link)}
        />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">QA データベース・資料登録</h1>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          <TopActionBar onSearch={handleSearch} onUploadClick={handleOpenUploadModal} />
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <QaListCards
              qaItems={qas}
              onSelect={handleSelectQA}
              onEdit={handleSelectQA}
              onDelete={handleDeleteQa}
              filters={{
                tag: searchParams.tag,
                genre: searchParams.genre,
                fiscalPeriod: searchParams.fiscalPeriod,
                sort: searchParams.sort,
                order: searchParams.order,
                reviewStatus: searchParams.review_status,
                page: searchParams.page,
                limit: searchParams.limit,
                totalCount: totalCount,
                totalPages: totalPages
              }}
              onFilterChange={handleFilterChange}
            />
          )}
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: "利用規約", href: "/terms" },
          { label: "プライバシーポリシー", href: "/privacy" },
        ]}
        copyrightText="MyApp Inc."
        onSelectLink={(href) => router.push(href)}
      />
      {/* QA詳細モーダル（role="corporate"で編集ボタン付き） */}
      {selectedQa && (
        <QaDetailModal
          qa={selectedQa}
          isOpen={true}
          role="corporate"
          onClose={() => setSelectedQa(null)}
          onLike={(id: string) => {
            console.log("いいね", id);
          }}
          onDelete={(id: string) => handleDeleteQa(id)}
          onSaveEdit={(updatedQa: QA) => {
            console.log("QA更新:", updatedQa);
            setQas((prev) =>
              prev.map((q) => (q.qaId === updatedQa.qaId ? updatedQa : q))
            );
            setSelectedQa(null);
          }}
        />
      )}
      {isUploadModalOpen && (
        <UploadModal onClose={handleCloseUploadModal} onConfirm={handleConfirmUpload} />
      )}
    </div>
  );
};

export default QaPage;
