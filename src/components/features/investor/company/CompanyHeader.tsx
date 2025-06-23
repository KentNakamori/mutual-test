// src/components/features/investor/company/CompanyHeader.tsx
import React, { useState, useEffect } from 'react';
import { CompanyHeaderProps } from '../../../../types';
import { getFullImageUrl } from '@/lib/utils/imageUtils';
import { X } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0';

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company, onFollowStatusChange }) => {
  const { user, isLoading: userLoading } = useUser();
  const [isFollowing, setIsFollowing] = useState(company.isFollowed || false);
  const [isLoading, setIsLoading] = useState(false);
  
  // ゲスト判定
  const isGuest = !user && !userLoading;
  
  const handleBackClick = () => {
    window.location.assign('/investor/companies');
  };

  // propsからフォロー状態が変更された時に更新
  useEffect(() => {
    if (company.isFollowed !== undefined) {
      setIsFollowing(company.isFollowed);
    }
  }, [company.isFollowed]);

  const handleFollowToggle = async () => {
    if (isGuest) {
      window.location.assign('/investor/login');
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      // バックエンドの実装に合わせて全てPOSTメソッドを使用
      const response = await fetch(`/api/proxy/investor/companies/${company.companyId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: isFollowing ? 'unfollow' : 'follow' 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'フォロー操作に失敗しました');
      }

      const data = await response.json();
      const newFollowStatus = data.isFollowed;
      
      setIsFollowing(newFollowStatus);
      
      // 親コンポーネントにフォロー状態の変更を通知
      if (onFollowStatusChange) {
        onFollowStatusChange(newFollowStatus);
      }
      
      console.log(data.message);
    } catch (error) {
      console.error('フォロー操作に失敗しました:', error);
      alert(`フォロー操作に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-2 flex items-center justify-between">
      {/* 左側：ロゴと企業情報を横並び */}
      <div className="flex items-center space-x-3">
        {/* ロゴ：横長の統一された枠 */}
        {company.logoUrl ? (
          <div className="w-20 h-12 flex items-center justify-center bg-gray-50 rounded border overflow-hidden">
            <img
              src={getFullImageUrl(company.logoUrl)}
              alt={`${company.companyName} のロゴ`}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-20 h-12 rounded border bg-gray-300 flex items-center justify-center">
            <span className="font-semibold text-white text-sm">
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
            <p className="text-sm text-gray-600">{company.industry}</p>
          </div>
        </div>
      </div>
      
      {/* 右側：フォローボタンと戻るボタン */}
      <div className="flex items-center gap-3">
        {/* フォローボタン */}
        {isGuest ? (
          <button 
            onClick={() => window.location.assign('/investor/login')}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            <span className="font-medium">ログインが必要</span>
          </button>
        ) : (
          <button 
            onClick={handleFollowToggle}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
              isFollowing 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="font-medium">
              {isLoading ? '処理中...' : isFollowing ? 'フォロー中' : 'フォローする'}
            </span>
          </button>
        )}
        
        {/* 戻るボタン */}
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors" 
          onClick={handleBackClick}
          aria-label="戻る"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default CompanyHeader;
