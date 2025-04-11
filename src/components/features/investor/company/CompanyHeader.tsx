// src/components/features/investor/company/CompanyHeader.tsx
import React from 'react';
import { Company, CompanyHeaderProps } from '../../../../types';

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  const handleBackClick = () => {
    window.location.assign('/investor/companies');
  };

  return (
    // 全体のマージンを削減して行間を詰める
    <div className="mb-2 flex items-center justify-between">
      {/* 左側：ロゴ、会社名、企業情報 */}
      <div className="flex flex-col">
        {/* 上部：ロゴと会社名（間隔を狭く） */}
        <div className="flex items-center space-x-2">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={`${company.companyName} のロゴ`}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-base font-semibold text-white">
                {company.companyName.charAt(0)}
              </span>
            </div>
          )}
          <h1 className="text-xl font-semibold">{company.companyName}</h1>
        </div>
        {/* 下部：企業情報（余白を狭く：mt-1 と間隔調整） */}
        <div className="flex items-center space-x-2 mt-1">
          {company.securitiesCode && (
            <p className="text-gray-600 text-xs">証券コード: {company.securitiesCode}</p>
          )}
          {company.majorStockExchange && (
            <p className="text-gray-600 text-xs">主要取引所: {company.majorStockExchange}</p>
          )}
          {company.websiteUrl && (
            <p className="text-gray-600 text-xs">
              HP:{" "}
              <a
                href={company.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {company.websiteUrl}
              </a>
            </p>
          )}
          <p className="text-gray-600 text-xs">{company.industry}</p>
        </div>
      </div>
      {/* 右側：戻るボタン */}
      <div className="cursor-pointer" onClick={handleBackClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </div>
  );
};

export default CompanyHeader;
