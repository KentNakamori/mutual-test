"use client";

import React from "react";
import { Company } from "@/types/domain";
import CompanyCard from "./CompanyCard";

interface CompanyListProps {
  companies: Company[];
  isLoading?: boolean;
  errorMessage?: string;
  // 企業をクリックした時のハンドラを受ける場合は以下のように
  onSelectCompany?: (companyId: string) => void;
}

export default function CompanyList({
  companies,
  isLoading,
  errorMessage,
  onSelectCompany,
}: CompanyListProps) {
  if (isLoading) {
    return <div>企業情報を読み込み中...</div>;
  }

  if (errorMessage) {
    return <div className="text-error">{errorMessage}</div>;
  }

  if (!companies.length) {
    return <div className="text-sm text-gray-600">企業が見つかりません。</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onClick={(id) => onSelectCompany?.(id)}
        />
      ))}
    </div>
  );
}
