// src/hooks/useCorporateCompanySettings.ts
import { useQuery } from 'react-query';
import { getCorporateCompanySettings } from '../libs/api';
import { CompanyInfo } from '../types';
import { useAuth } from './useAuth';

// モックデータ：バックエンドが接続されていない場合でもUI確認用に利用
const mockCompanyInfo: CompanyInfo = {
  companyName: "株式会社モック",
  address: "東京都新宿区西新宿1-1-1",
  email: "contact@mock.co.jp",
  tel: "03-1234-5678",
};

export const useCorporateCompanySettings = (token: string | null) => {
  const { isAuthenticated } = useAuth();

  const queryFn = async (): Promise<CompanyInfo> => {
    if (!token) {
      // トークンがない場合、モックデータを返す（500ms後に解決）
      return new Promise((resolve) => setTimeout(() => resolve(mockCompanyInfo), 500));
    }
    // トークンが存在する場合は実際のAPI呼び出しを試みる
    try {
      return await getCorporateCompanySettings(token);
    } catch (err) {
      // API呼び出しエラー時は、モックデータを返す
      return mockCompanyInfo;
    }
  };

  const { data, error, isLoading, refetch } = useQuery<CompanyInfo>(
    ['corporateCompanySettings'],
    queryFn,
    {
      enabled: true, // 常に実行（モックデータが利用されるため）
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    }
  );

  return {
    companyInfo: data,
    error,
    isLoading,
    refetch,
  };
};
