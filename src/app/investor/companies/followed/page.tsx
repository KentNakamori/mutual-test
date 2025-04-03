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
  { label: "Q&A", link: "/investor/qa" },
  { label: "チャットログ", link: "/investor/chat-logs" },
  { label: "マイページ", link: "/investor/mypage" },
];

const mockCompanies: Company[] = [
  {
    companyId: "1",
    companyName: "株式会社A",
    industry: "テクノロジー",
    logoUrl: "/logoA.png",
    isFollowed: true,
  },
  {
    companyId: "2",
    companyName: "株式会社B",
    industry: "エネルギー",
    logoUrl: "/logoB.png",
    isFollowed: false,
  },
  {
    companyId: "3",
    companyName: "株式会社C",
    industry: "ヘルスケア",
    logoUrl: "/logoC.png",
    isFollowed: true,
  },
  // 必要に応じて追加
];

const FollowedCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [query, setQuery] = useState<CompanySearchQuery>({ keyword: "", industry: "" });

  // 初回ロード時にフォロー済みの企業のみをセット
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
    setCompanies((prev) =>
      prev.filter((company) => company.companyId !== companyId || nextState)
    );
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
          <CompanySearchBar initialQuery={query} onSearchChange={handleSearchChange} />
          <CompanyList companies={companies} onFollowToggle={handleFollowToggle} />
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
