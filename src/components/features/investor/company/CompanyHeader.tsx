// src/components/features/investor/company/CompanyHeader.tsx
import React from 'react';
import { Company, CompanyHeaderProps } from '../../../../types';
import { getIndustryLabel } from '@/types/industry';

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  const handleBackClick = () => {
    window.location.assign('/investor/companies');
  };
  return (
    <div className="mb-4 flex items-center justify-between">
      {/* 左側：ロゴ、会社名、企業情報 */}
      <div className="flex flex-col">
        {/* 上部：ロゴと会社名 */}
        <div className="flex items-center space-x-3">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={`${company.companyName} のロゴ`}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="font-semibold text-white">
                {company.companyName.charAt(0)}
              </span>
            </div>
          )}
          <h1 className="font-semibold">{company.companyName}</h1>
        </div>
        {/* 下部：企業情報 */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {company.securitiesCode && (
            <p className="text-gray-600">証券コード: {company.securitiesCode}</p>
          )}
          {company.securitiesCode && company.majorStockExchange && (
            <span className="text-gray-400 mx-1">|</span>
          )}
          {company.majorStockExchange && (
            <p className="text-gray-600">主要取引所: {company.majorStockExchange}</p>
          )}
          {company.majorStockExchange && company.websiteUrl && (
            <span className="text-gray-400 mx-1">|</span>
          )}
          {company.websiteUrl && (
            <p className="text-gray-600">
              HP:{" "}
              <a
                href={company.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                {company.websiteUrl}
              </a>
            </p>
          )}
          {company.websiteUrl && company.industry && (
            <span className="text-gray-400 mx-1">|</span>
          )}
          <p className="text-gray-600">{getIndustryLabel(company.industry)}</p>
        </div>
      </div>
      {/* 右側：戻るボタン */}
      <button 
        className="p-2 rounded-full hover:bg-gray-100 transition-colors" 
        onClick={handleBackClick}
        aria-label="戻る"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default CompanyHeader;
