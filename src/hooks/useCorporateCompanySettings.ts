import { useQuery } from 'react-query';
import { getCorporateCompanySettings } from '../libs/api';
import { CompanyInfo } from '../types';
import { useAuth } from './useAuth';

// モックデータ：バックエンドが接続されていない場合の確認用
const mockCompanyInfo: CompanyInfo = {
  companyName: "株式会社モック",
  address: "東京都新宿区西新宿1-1-1",
  email: "contact@mock.co.jp",
  tel: "03-1234-5678",
};

export const useCorporateCompanySettings = (token: string | null) => {
  // トークンが存在する場合のみAPIを実行（トークンがない場合はモックデータを利用）
  const queryFn = async (): Promise<CompanyInfo> => {
    return await getCorporateCompanySettings(token!);
  };

  // トークンもクエリキーに含め、トークンが存在する場合のみクエリが有効になるように設定
  const { data, error, isLoading, refetch } = useQuery<CompanyInfo>(
    ['corporateCompanySettings', token],
    queryFn,
    {
      enabled: !!token,
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    }
  );

  // トークンがなければモックデータを返す
  const companyInfo = token ? data : undefined;

  return {
    companyInfo,
    error,
    isLoading,
    refetch,
  };
};