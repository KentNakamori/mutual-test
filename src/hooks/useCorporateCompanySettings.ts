import { useQuery } from '@tanstack/react-query';
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
  const { user, isLoading: isUserLoading, error: userError } = useUser();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['corporateCompanySettings'],
    queryFn: async () => {
      // ユーザーが認証されていない場合はエラーを投げる
      if (!user) {
        throw new Error('認証が必要です');
      }
      // プロキシがJWTを自動的に付与するため、トークンの受け渡しは不要
      return await getCorporateCompanySettings();
    },
    enabled: !isUserLoading && !!user,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    retry: 1, // エラー時のリトライ回数を1回に制限
  });

  return {
    companyInfo: data,
    error: error || userError, // 認証エラーとAPIエラーを統合
    isLoading: isLoading || isUserLoading, // ユーザー情報の読み込み状態も含める
    refetch,
  };
};