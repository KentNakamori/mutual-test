// src/components/features/investor/companies/CompanyList.tsx
import React from 'react';
import { Company } from '../../../../types';
import CompanyCard from './CompanyCard';

export interface CompanyListProps {
  companies: Company[];
  onFollowToggle: (companyId: string, nextState: boolean) => void;
}

/**
 * CompanyList コンポーネント
 * ── 企業一覧データを受け取り、グリッド表示します。
 *     企業データが存在しない場合は「企業が見つかりませんでした」と表示します。
 */
const CompanyList: React.FC<CompanyListProps> = ({ companies, onFollowToggle }) => {
  if (companies.length === 0) {
    return <div className="text-center py-8">企業が見つかりませんでした</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyCard key={company.companyId} company={company} onFollowToggle={onFollowToggle} />
      ))}
    </div>
  );
};

export default CompanyList;
