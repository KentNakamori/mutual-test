// src/components/features/companies/CompanyHeader.tsx
import React from "react";
import { CompanyDetailResponse } from "@/types/api";

type CompanyHeaderProps = {
  companyDetail: CompanyDetailResponse;
};

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ companyDetail }) => {
  const { name, industry, logoUrl, description } = companyDetail;

  return (
    <header className="w-full bg-white shadow-sm p-4 flex items-center gap-4 mb-4">
      {/* ロゴ */}
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="w-16 h-16 object-cover rounded"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded" />
      )}

      <div>
        <h1 className="text-2xl font-semibold">{name}</h1>
        {industry && <p className="text-sm text-gray-600">業種: {industry}</p>}
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </header>
  );
};

export default CompanyHeader;
