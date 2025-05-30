// src/components/features/investor/company/CompanyHeader.tsx
import React from 'react';
import { Company, CompanyHeaderProps } from '../../../../types';
import { getIndustryLabel } from '@/types/industry';
import { getFullImageUrl } from '@/lib/utils/imageUtils';

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  const handleBackClick = () => {
    window.location.assign('/investor/companies');
  };
  return (
    <div className="mb-2 flex items-center justify-between">
      {/* 左側：ロゴと企業情報を横並び */}
      <div className="flex items-center space-x-3">
        {/* ロゴ：縦幅いっぱい */}
        {company.logoUrl ? (
          <img
            src={getFullImageUrl(company.logoUrl)}
            alt={`${company.companyName} のロゴ`}
            className="h-14 w-auto max-w-[80px] rounded-md object-contain"
          />
        ) : (
          <div className="h-14 w-14 rounded-md bg-gray-300 flex items-center justify-center">
            <span className="font-semibold text-white text-lg">
              {company.companyName.charAt(0)}
            </span>
          </div>
        )}
        
        {/* 企業情報：ロゴの右側に縦配置 */}
        <div className="flex flex-col justify-center">
          {/* 会社名 */}
          <h1 className="text-xl font-semibold mb-1">{company.companyName}</h1>
          
          {/* 企業詳細情報 */}
          <div className="flex flex-wrap items-center gap-2">
            {company.securitiesCode && (
              <p className="text-sm text-gray-600">証券コード: {company.securitiesCode}</p>
            )}
            {company.securitiesCode && company.majorStockExchange && (
              <span className="text-gray-400 mx-1">|</span>
            )}
            {company.majorStockExchange && (
              <p className="text-sm text-gray-600">主要取引所: {company.majorStockExchange}</p>
            )}
            {company.majorStockExchange && company.websiteUrl && (
              <span className="text-gray-400 mx-1">|</span>
            )}
            {company.websiteUrl && (
              <p className="text-sm text-gray-600">
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
            <p className="text-sm text-gray-600">{getIndustryLabel(company.industry)}</p>
          </div>
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
