//src\components\features\investor\company\CompanyHeader.tsx

import React from 'react';
import { Company, CompanyHeaderProps } from '../../../../types';


/**
 * CompanyHeader コンポーネント
 * 企業ロゴ、企業名、業種などの基本情報を表示します。
 */
const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      {company.logoUrl ? (
        <img src={company.logoUrl} alt={company.companyName} className="h-16 w-16 rounded-full" />
      ) : (
        <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-xl font-semibold text-white">{company.companyName.charAt(0)}</span>
        </div>
      )}
      <div>
        <h1 className="text-2xl font-semibold">{company.companyName}</h1>
        <p className="text-gray-600">{company.industry}</p>
      </div>
    </div>
  );
};

export default CompanyHeader;
