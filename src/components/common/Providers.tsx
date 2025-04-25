/**
 * アプリケーション全体のプロバイダーコンポーネント
 * 
 * このコンポーネントは以下の機能を提供します：
 * - Auth0認証プロバイダーの設定
 *   - ユーザー認証状態の管理
 *   - 認証トークンの管理
 *   - ログイン/ログアウト機能の提供
 * 
 * - React Queryクライアントの設定
 *   - データフェッチングのキャッシュ管理
 *   - サーバー状態の同期
 *   - エラーハンドリング
 * 
 * - アプリケーション全体の状態管理
 *   - グローバルな状態の共有
 *   - コンポーネント間のデータ共有
 * 
 * @component
 * @param {React.ReactNode} children - プロバイダーでラップする子コンポーネント
 * @returns {JSX.Element} プロバイダーでラップされたコンポーネント
 */
// src/app/components/common/Providers.tsx
'use client';

import React, { useState } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { QueryClient, QueryClientProvider } from 'react-query';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>{children}</UserProvider>
    </QueryClientProvider>
  );
};
