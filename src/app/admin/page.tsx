"use client";

import React from "react";
import Link from "next/link";

const AdminPage: React.FC = () => {
  // ミドルウェアで認証チェック済みなので、ここに到達した時点で管理者確定
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              管理者ダッシュボード
            </h1>
            <p className="text-gray-600">
              システム管理機能へのアクセス
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* 企業登録ボタン */}
            <Link href="/admin/companies">
              <div className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md transition-colors duration-200 cursor-pointer group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-300 transition-colors duration-200">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">企業登録</h2>
                  <p className="text-blue-100 text-sm">
                    新しい企業情報の登録
                  </p>
                </div>
              </div>
            </Link>

            {/* ユーザー管理ボタン */}
            <Link href="/admin/users">
              <div className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md transition-colors duration-200 cursor-pointer group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-300 transition-colors duration-200">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">ユーザー管理</h2>
                  <p className="text-green-100 text-sm">
                    企業ユーザーの作成
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 