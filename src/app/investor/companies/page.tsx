// src/app/investor/companies/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
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

// ── 企業一覧ページコンポーネント ─────────────────────────────────────────────
const CompaniesPage: React.FC = () => {
  // 企業一覧、読み込み状態、エラー、検索条件のローカルステート
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
      }, 500); // 500ms のディレイでレスポンスをシミュレート
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
    // 通常は API 呼び出しなどを行いますが、ここではモックとしてログ出力
    console.log(`企業 ${companyId} のフォロー状態が ${nextState ? 'フォロー中' : 'フォロー解除'} に変更されました`);
  };

  // ヘッダー用のナビゲーションリンク（日本語）
  const navigationLinks = [
    { label: 'ホーム', href: '/' },
    { label: '企業一覧', href: '/companies' },
    { label: 'お問い合わせ', href: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        navigationLinks={navigationLinks}
        userStatus={{ isLoggedIn: true, userName: '山田太郎' }}
        onClickLogo={() => (window.location.href = '/')}
      />
      <main className="flex-grow container mx-auto p-4">
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
