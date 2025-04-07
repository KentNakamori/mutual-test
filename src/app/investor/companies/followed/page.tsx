// src/app/investor/companies/followed/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";
import CompanySearchBar, { CompanySearchQuery } from "@/components/features/investor/companies/CompanySearchBar";
import CompanyList from "@/components/features/investor/companies/CompanyList";
import { Company } from "@/types";

const sidebarMenuItems = [
  { label: "トップページ", link: "/investor/companies" },
  { label: "フォロー済み企業", link: "/investor/companies/followed" },
  { label: "Q&A検索", link: "/investor/qa" },
  { label: "チャットログ", link: "/investor/chat-logs" },
  { label: "マイページ", link: "/investor/mypage" },
];

interface ExtendedCompany extends Company {
  isFollowed: boolean;
}

const mockCompanies: ExtendedCompany[] = [
  {
    companyId: "1",
    companyName: "株式会社A",
    industry: "テクノロジー",
    logoUrl: "/logoA.png",
    isFollowed: true,
    securitiesCode: "1111",
    majorStockExchange: "Tokyo Stock Exchange",
    websiteUrl: "https://www.companya.co.jp",
  },
  {
    companyId: "2",
    companyName: "株式会社B",
    industry: "エネルギー",
    logoUrl: "/logoB.png",
    isFollowed: false,
    securitiesCode: "2222",
    majorStockExchange: "Osaka Exchange",
    websiteUrl: "https://www.companyb.co.jp",
  },
  {
    companyId: "3",
    companyName: "株式会社C",
    industry: "ヘルスケア",
    logoUrl: "/logoC.png",
    isFollowed: true,
    securitiesCode: "3333",
    majorStockExchange: "Tokyo Stock Exchange",
    websiteUrl: "https://www.companyc.co.jp",
  },
  // 必要に応じて追加
];

const FollowedCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<ExtendedCompany[]>([]);
  const [query, setQuery] = useState<CompanySearchQuery>({ keyword: "", industry: "" });

  // 初回ロード時にフォロー済み企業のみをセット
  useEffect(() => {
    const followed = mockCompanies.filter((company) => company.isFollowed);
    setCompanies(followed);
  }, []);

  const handleSearchChange = (newQuery: CompanySearchQuery) => {
    setQuery(newQuery);
    const filtered = mockCompanies.filter(
      (company) =>
        company.isFollowed &&
        company.companyName.toLowerCase().includes(newQuery.keyword.toLowerCase()) &&
        (newQuery.industry ? company.industry.toLowerCase() === newQuery.industry.toLowerCase() : true)
    );
    setCompanies(filtered);
  };

  const handleFollowToggle = (companyId: string, nextState: boolean) => {
    // モック上でのフォロー状態更新（実際はAPI連携になる想定）
    const updatedCompanies = companies
      .map((company) => {
        if (company.companyId === companyId) {
          return { ...company, isFollowed: nextState };
        }
        return company;
      })
      .filter((company) => company.isFollowed); // フォロー済みのみ表示
    setCompanies(updatedCompanies);
  };

  // CompanyCard クリック時のハンドラ：企業詳細ページへ遷移
  const handleCardClick = (companyId: string) => {
    window.location.assign(`/investor/company/${companyId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          menuItems={sidebarMenuItems}
          isCollapsible
          selectedItem="/investor/companies/followed"
          onSelectMenuItem={(link) => window.location.assign(link)}
        />
        <main className="flex-1 container mx-auto p-4 bg-gray-50">
          {/* ページ上部の表題 */}
          <h1 className="text-2xl font-semibold mb-4">フォロー済み企業一覧</h1>
          <CompanySearchBar initialQuery={query} onSearchChange={handleSearchChange} />
          <CompanyList
            companies={companies}
            onFollowToggle={handleFollowToggle}
            onCardClick={handleCardClick}
          />
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: "利用規約", href: "/terms" },
          { label: "プライバシーポリシー", href: "/privacy" },
        ]}
        copyrightText="MyCompany Inc."
        onSelectLink={(href) => window.location.assign(href)}
      />
    </div>
  );
};

export default FollowedCompaniesPage;
