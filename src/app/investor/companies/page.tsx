//src\app\investor\companies\page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/common/Sidebar';
import Footer from '@/components/common/Footer';
import CompanySearchBar from '@/components/features/investor/companies/CompanySearchBar';
import CompanyList from '@/components/features/investor/companies/CompanyList';
import { Company } from '@/types';

// ── モックデータ ─────────────────────────────────────────────
const mockCompanies: Company[] = [
  {
    companyId: '1',
    companyName: 'テック・イノベーターズ株式会社',
    industry: 'テクノロジー',
    logoUrl: '/assets/logos/tech_innovators.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    adminUserIds: ['user1'],
  },
  {
    companyId: '2',
    companyName: 'グリーンエナジー株式会社',
    industry: 'エネルギー',
    logoUrl: '/assets/logos/green_energy.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    adminUserIds: ['user2'],
  },
  {
    companyId: '3',
    companyName: 'ヘルスプラス合同会社',
    industry: 'ヘルスケア',
    logoUrl: '/assets/logos/health_plus.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    adminUserIds: ['user3'],
  },
];

// サイドバーのメニュー項目
const menuItems = [
  { label: 'マイページ', link: '/investor/mypage' },
  { label: 'Q&A', link: '/investor/qa' },
  { label: 'チャットログ', link: '/investor/chat-logs' },
  { label: '企業一覧', link: '/investor/companies' },
];

const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<{ keyword: string; industry?: string }>({
    keyword: '',
    industry: '',
  });

  // モックのAPI呼び出し（検索条件に応じてモックデータをフィルタリング）
  const fetchCompanies = async (query: { keyword: string; industry?: string }): Promise<Company[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockCompanies.filter((company) => {
          const matchesKeyword = query.keyword
            ? company.companyName.toLowerCase().includes(query.keyword.toLowerCase())
            : true;
          const matchesIndustry = query.industry
            ? company.industry.toLowerCase() === query.industry.toLowerCase()
            : true;
          return matchesKeyword && matchesIndustry;
        });
        resolve(filtered);
      }, 500);
    });
  };

  // CompanySearchBar からの検索条件変更ハンドラ
  const handleSearchChange = async (newQuery: { keyword: string; industry?: string }) => {
    setSearchQuery(newQuery);
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCompanies(newQuery);
      setCompanies(data);
    } catch (err: any) {
      setError(err.message || '企業データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 初回レンダリング時にデータ取得
  useEffect(() => {
    handleSearchChange(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CompanyCard からのフォロー操作ハンドラ
  const handleFollowToggle = (companyId: string, nextState: boolean) => {
    console.log(`企業 ${companyId} のフォロー状態が ${nextState ? 'フォロー中' : 'フォロー解除'} に変更されました`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー削除 → サイドバーに置き換え */}
      <div className="flex flex-1">
        <Sidebar
          isCollapsible
          menuItems={menuItems}
          selectedItem="/investor/companies"
          onSelectMenuItem={(link) => (window.location.href = link)}
        />
        <main className="flex-1 container mx-auto p-4">
          <CompanySearchBar initialQuery={searchQuery} onSearchChange={handleSearchChange} />
          {isLoading ? (
            <div className="text-center py-8">企業データを読み込み中…</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              {error}
              <button onClick={() => handleSearchChange(searchQuery)} className="ml-4 underline">
                再試行
              </button>
            </div>
          ) : (
            <CompanyList companies={companies} onFollowToggle={handleFollowToggle} />
          )}
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: '利用規約', href: '/terms' },
          { label: 'プライバシーポリシー', href: '/privacy' },
        ]}
        copyrightText="MyApp株式会社"
      />
    </div>
  );
};

export default CompaniesPage;
