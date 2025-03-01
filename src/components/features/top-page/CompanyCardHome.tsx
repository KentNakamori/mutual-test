/**
 * @file CompanyCardHome.tsx
 * @description 企業カード表示。1社分の情報をカードとして表示
 */

import React from "react";
import { Company } from "@/types/domain";
import Card from "@/components/ui/Card"; // shadcnラップ済みのCardコンポーネント例

interface CompanyCardHomeProps {
  company: Company;
  // 企業詳細ページに遷移するなどのイベントが必要なら追加
  onClick?: (companyId: string) => void;
}

const CompanyCardHome: React.FC<CompanyCardHomeProps> = ({ company, onClick }) => {
  const handleCardClick = () => {
    if (onClick) onClick(company.id);
    // 例: Next.js のルーターで `/companies/${company.id}` へ遷移したい場合など
  };

  return (
    <Card
      title={company.name}
      description={company.industry ? `業種: ${company.industry}` : "業種: -"}
      onClick={handleCardClick}
      footer={
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-500">
            フォロワー数: {company.followerCount ?? 0}
          </div>
          <button
            className="text-sm text-black hover:underline"
            onClick={() => alert(`企業「${company.name}」をフォローしました(仮)`)}
          >
            フォロー
          </button>
        </div>
      }
    >
      <div className="text-base text-gray-600 leading-relaxed">
        {company.description || "企業紹介文がありません。"}
      </div>
    </Card>
  );
};

export default CompanyCardHome;
