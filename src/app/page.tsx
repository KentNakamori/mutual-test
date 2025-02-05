import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Header from '@/components/common/layout/Header';
import Sidebar from '@/components/common/layout/Sidebar';
import MainGrid from '@/components/common/layout/MainGrid';
import DashboardGrid from '@/components/features/dashboard/DashboardGrid';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// エラーフォールバックコンポーネント
const ErrorFallback = ({ error, resetErrorBoundary }: { 
  error: Error; 
  resetErrorBoundary: () => void;
}) => {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertTitle>エラーが発生しました</AlertTitle>
      <AlertDescription>
        <p className="mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
        >
          再試行
        </button>
      </AlertDescription>
    </Alert>
  );
};

// 認証状態を確認するラッパーコンポーネント
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 認証状態の確認ロジックをここに実装
  // 例: useAuth() フックを使用するなど
  const isAuthenticated = true; // 実際の認証チェックに置き換える

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            ログインが必要です
          </h1>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// ページコンポーネント
export default function HomePage() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // エラーリセット時の処理
        window.location.reload();
      }}
    >
      <AuthWrapper>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Sidebar />
          <MainGrid>
            <div className="w-full">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  IR ダッシュボード
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  投資家とのコミュニケーション状況を一目で確認できます
                </p>
              </div>
              <DashboardGrid />
            </div>
          </MainGrid>
        </div>
      </AuthWrapper>
    </ErrorBoundary>
  );
}

// メタデータの設定
export const metadata = {
  title: 'IR ダッシュボード',
  description: '投資家とのコミュニケーション管理ダッシュボード',
};

// ページの静的生成設定
export const dynamic = 'force-dynamic'; // SSRモードで動作させる