'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowLeft, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <Shield className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          アクセス権限がありません
        </h1>
        
        <p className="text-gray-600 mb-8">
          このページにアクセスするには管理者権限が必要です。
          適切な権限を持つアカウントでログインしてください。
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/admin/login')}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <LogIn className="h-4 w-4 mr-2" />
            管理者ログイン
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ホームページに戻る
          </button>
        </div>
      </div>
    </div>
  );
} 