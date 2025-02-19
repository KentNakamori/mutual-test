"use client";

import React from "react";
import { Company } from "@/types/domain";

interface CompanyCardProps {
  company: Company;
  onClick?: (id: string) => void;
}

export default function CompanyCard({ company, onClick }: CompanyCardProps) {
  const handleClick = () => {
    onClick?.(company.id);
  };

  return (
    <div
      className="bg-white border border-gray-100 rounded shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={handleClick}
    >
      {/* ロゴ (任意) */}
      {company.logoUrl && (
        <div className="mb-2">
          <img
            src={company.logoUrl}
            alt={`${company.name}のロゴ`}
            className="w-20 h-20 object-contain"
          />
        </div>
      )}
      {/* 企業名 */}
      <h3 className="text-lg font-semibold mb-1">{company.name}</h3>
      {/* 業種 */}
      {company.industry && (
        <p className="text-sm text-gray-600 mb-1">{company.industry}</p>
      )}
      {/* 企業説明 (抜粋) */}
      {company.description && (
        <p className="text-sm text-gray-700 line-clamp-3">
          {company.description}
        </p>
      )}
    </div>
  );
}
