// src/components/features/investor/company/CompanyHeader.tsx
import React from 'react';
import { Company, CompanyHeaderProps } from '../../../../types';

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  const handleBackClick = () => {
    window.location.assign('/investor/companies');
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      {/* 左側：ロゴ、会社名、下部に企業情報 */}
      <div className="flex flex-col">
        {/* 上部：ロゴと会社名 */}
        <div className="flex items-center space-x-4">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={`${company.companyName} のロゴ`}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-lg font-semibold text-white">
                {company.companyName.charAt(0)}
              </span>
            </div>
          )}
          <h1 className="text-2xl font-semibold">{company.companyName}</h1>
        </div>
        {/* 下部：企業情報 */}
        <div className="flex items-center space-x-4 mt-2">
          {company.securitiesCode && (
            <p className="text-gray-600">証券コード: {company.securitiesCode}</p>
          )}
          {company.majorStockExchange && (
            <p className="text-gray-600">主要取引所: {company.majorStockExchange}</p>
          )}
          {company.websiteUrl && (
            <p className="text-gray-600">
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
          <p className="text-gray-600">{company.industry}</p>
        </div>
      </div>
      {/* 右側：バツ印アイコン（企業一覧ページへ戻る） */}
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
