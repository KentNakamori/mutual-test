import { useQuery } from 'react-query';
import { getCorporateCompanySettings } from '../lib/api';
import { CompanyInfo } from '../types';
import { useUser } from "@auth0/nextjs-auth0";

// モックデータ：バックエンドが接続されていない場合の確認用
const mockCompanyInfo: CompanyInfo = {
  companyName: "株式会社モック",
  address: "東京都新宿区西新宿1-1-1",
  email: "contact@mock.co.jp",
  tel: "03-1234-5678",
};

export const useCorporateCompanySettings = () => {
  const { user } = useUser();
  const token = user?.sub ?? null;

  const { data, error, isLoading, refetch } = useQuery<CompanyInfo>(
    ['corporateCompanySettings'],
    async () => {
      if (!token) {
        throw new Error('認証トークンがありません');
      }
      return await getCorporateCompanySettings(token);
    },
    {
      enabled: !!token,
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