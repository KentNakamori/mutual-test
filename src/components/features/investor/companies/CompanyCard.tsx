// src/components/features/investor/companies/CompanyCard.tsx
import React, { useState } from 'react';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import { Company, CompanyCardProps } from '../../../../types';

/**
 * CompanyCard コンポーネント
 * ── 単一企業の情報（ロゴ、社名、業種）をカード形式で表示し、
 *     フォローボタンでフォロー状態を切り替え、カードクリックで企業ページに遷移します。
 */
const CompanyCard: React.FC<CompanyCardProps> = ({ company, onFollowToggle, onCardClick }) => {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  const handleFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // カードクリックイベントを防止
    const nextState = !isFollowed;
    setIsFollowed(nextState);
    onFollowToggle(company.companyId, nextState);
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(company.companyId);
    }
  };

  return (
    <Card className="hover:shadow-lg cursor-pointer" onClick={handleCardClick}>
      <div className="flex flex-col items-center">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={`${company.companyName} のロゴ`}
            className="h-16 w-16 object-contain mb-4"
          />
        ) : (
          <div className="h-16 w-16 bg-gray-200 flex items-center justify-center mb-4">
            ロゴなし
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{company.companyName}</h3>
        <p className="text-sm text-gray-600 mb-4">{company.industry}</p>
        <Button label={isFollowed ? 'フォロー解除' : 'フォローする'} onClick={handleFollowClick} variant="outline" />
      </div>
    </Card>
  );
};

export default CompanyCard;
