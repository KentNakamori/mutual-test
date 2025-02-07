'use client';

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Header from '@/components/common/layout/Header';
import Sidebar from '@/components/common/layout/Sidebar';
import DashboardGrid from '@/components/features/dashboard/DashboardGrid';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

export default function HomePage() {
 return (
   <ErrorBoundary
     FallbackComponent={ErrorFallback}
     onReset={() => {
       window.location.reload();
     }}
   >
     <AuthWrapper>
       <div className="min-h-screen">
         <Header />
         <div className="flex h-screen overflow-hidden">
           <Sidebar />
           <main className="flex-1 pl-64 pt-16 bg-gray-50 overflow-auto">
             <div className="p-6">
               <div className="mb-6">
                 <h1 className="text-2xl font-semibold text-gray-900">
                   IRダッシュボード
                 </h1>
                 <p className="mt-1 text-sm text-gray-500">
                   投資家とのコミュニケーション状況を一目で確認できます
                 </p>
               </div>
               <DashboardGrid />
             </div>
           </main>
         </div>
       </div>
     </AuthWrapper>
   </ErrorBoundary>
 );
}

export const dynamic = 'force-dynamic';