"use client";

import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';

interface LogoImageProps {
  companyId: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  showPlaceholder?: boolean;
}

export const LogoImage: React.FC<LogoImageProps> = ({
  companyId,
  alt = "Company Logo",
  className = "w-32 h-16",
  fallbackSrc = '/default-logo.png',
  showPlaceholder = true,
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchLogoUrl = async () => {
    try {
      const response = await fetch(`/api/admin/logo/${companyId}`);
      if (!response.ok) {
        throw new Error('ロゴの取得に失敗しました');
      }
      const data = await response.json();
      setLogoUrl(data.logoUrl);
      setError(null);
    } catch (err) {
      console.error('ロゴ取得エラー:', err);
      setError('ロゴの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const refreshLogoUrl = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/admin/logo/${companyId}/refresh-url`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('URL更新に失敗しました');
      }
      
      const data = await response.json();
      setLogoUrl(data.logoUrl);
      setError(null);
    } catch (err) {
      console.error('URL更新エラー:', err);
      setError('URLの更新に失敗しました');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadLogo = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      await fetchLogoUrl();
    };

    loadLogo();
  }, [companyId]);

  // ローディング中の表示
  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded border`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // ロゴが存在しない、またはエラーの場合
  if (error || !logoUrl) {
    if (showPlaceholder) {
      return (
        <div className={`${className} flex items-center justify-center bg-gray-100 rounded border-2 border-dashed border-gray-300`}>
          <Image className="h-6 w-6 text-gray-400" />
        </div>
      );
    } else {
      return (
        <div className={`${className} flex items-center justify-center bg-gray-50 rounded border overflow-hidden`}>
          <img 
            src={fallbackSrc}
            alt={alt}
            className="w-full h-full object-contain"
          />
        </div>
      );
    }
  }

  // ロゴを表示 - 横長の枠に収める
  return (
    <div className={`${className} flex items-center justify-center bg-gray-50 rounded border overflow-hidden`}>
      <img 
        src={logoUrl}
        alt={alt}
        className="w-full h-full object-contain"
        onError={refreshLogoUrl}
      />
    </div>
  );
}; 