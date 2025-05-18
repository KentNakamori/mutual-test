// src/app/investor/companies/page.tsx
"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/common/sidebar';
import Footer from '@/components/common/footer';
import NewQAList from '@/components/features/investor/companies/NewQAList';
import CompanyListing from '@/components/features/investor/companies/CompanyListing';
import QaDetailModal from '@/components/ui/QaDetailModal';
import { Company, QA, CompanySearchQuery } from '@/types';
import { Home, Heart, Search, MessageSquare, User } from 'lucide-react';
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';

// モックデータ（例）
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

const mockQAs: (QA & { companyName?: string })[] = [
  {
    qaId: '1',
    title: '2025年度の業績見通しについて',
    question: '今期の業績見通しを教えてください。',
    answer:
      '当社では、既存事業の拡大と新規事業への投資により前年比20%の成長を計画しております。',
    companyId: 'comp1',
    companyName: 'テック・イノベーター株式会社',
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
      '当社はリファラル採用の強化、福利厚生の拡充などで人材確保を図っています。',
    companyId: 'comp2',
    companyName: 'グリーンエナジー株式会社',
    likeCount: 8,
    tags: ['決算説明動画'],
    genre: ['人材戦略'],
    fiscalPeriod: '2025年度 Q2',
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2023-10-01T00:00:00Z',
    isPublished: true,
  },
];

const menuItems = [
  { label: 'トップページ', link: '/investor/companies', icon: <Home size={20} /> },
  { label: "フォロー済み企業", link: "/investor/companies/followed", icon: <Heart size={20} /> },
  { label: 'Q&A検索', link: '/investor/qa', icon: <Search size={20} /> },
  { label: 'チャットログ', link: '/investor/chat-logs', icon: <MessageSquare size={20} /> },
  { label: 'マイページ', link: '/investor/mypage', icon: <User size={20} /> },
];

const CompaniesPageClient: React.FC = () => {
  const { user, isLoading: userLoading, error: userError } = useUser();
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  
  if (userLoading || dataLoading) {
    return <div>読み込み中...</div>;
  }
  if (userError || !user) {
    return <div>ログイン情報を取得できません</div>;
  }
  if (dataError) {
    return <div>データの取得に失敗しました</div>;
  }
  
  // 検索条件（初期値）
  const [searchQuery, setSearchQuery] = useState<CompanySearchQuery>({ keyword: '', industry: '' });

  // QA詳細モーダル表示用の状態
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          isCollapsible
          menuItems={menuItems}
          selectedItem="/investor/companies"
          onSelectMenuItem={(link) => window.location.assign(link)}
        />
        <main className="flex-1 container mx-auto p-4 bg-gray-50">
          {/* 新着QAリスト：クリックすると QA 詳細モーダルが表示される */}
          <NewQAList
            qas={mockQAs}
            onRowClick={(qa) => setSelectedQA(qa)}
          />
          <h1 className="text-2xl font-semibold mb-2">企業一覧</h1>
          <CompanyListing />
          {/* QA詳細モーダルの表示 */}
          {selectedQA && (
            <QaDetailModal
              qa={selectedQA}
              role="investor"
              isOpen={true}
              onClose={() => setSelectedQA(null)}
              onLike={(id: string) => console.log("いいね:", id)}
            />
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

export default async function CompaniesPage() {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/api/auth/investor-login');
  }
  
  const userType = session.user['https://your-domain/userType'];
  if (userType !== 'investor') {
    redirect('/api/auth/investor-login');
  }
  
  return <CompaniesPageClient />;
}
