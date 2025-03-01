/**
 * @file CompanyListSection.tsx
 * @description トップページで表示する「企業一覧」部分。CompanyCardを繰り返し表示
 */

import React from "react";
import { Company } from "@/types/domain";
import CompanyCardHome from "./CompanyCardHome";

interface CompanyListSectionProps {
  companies: Company[];
  isLoading?: boolean;
  errorMessage?: string;
}

const CompanyListSection: React.FC<CompanyListSectionProps> = ({
  companies,
  isLoading,
  errorMessage,
}) => {
  if (isLoading) {
    return (
      <div className="text-gray-500">
        データを読み込み中です...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-error text-error p-4 rounded">
        {errorMessage}
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return <div className="text-gray-500">企業が見つかりませんでした。</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyCardHome key={company.id} company={company} />
      ))}
    </div>
  );
};

export default CompanyListSection;
