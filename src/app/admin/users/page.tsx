"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

interface Company {
  companyId: string;
  companyName: string;
}

export default function UserInvitePage() {
  const router = useRouter();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [flash, setFlash] = useState<string | null>(null);

  // 企業一覧を取得
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error("企業一覧の取得に失敗しました");
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("企業一覧取得エラー:", error);
        setFlash("❌ 企業一覧の取得に失敗しました");
      }
    };

    fetchCompanies();
  }, []);

  // ユーザー登録
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlash(null);

    if (!selectedCompanyId) {
      setFlash("❌ 企業を選択してください");
      return;
    }

    if (!email) {
      setFlash("❌ メールアドレスを入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: selectedCompanyId,
          email: email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || "ユーザー登録に失敗しました";
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setFlash(`✅ ${result.message || 'ユーザーアカウントを作成し、招待メールを送信しました。ユーザーはメール内のリンクからパスワードを設定できます。'}`);
      setEmail("");
      setSelectedCompanyId("");
    } catch (error) {
      console.error("ユーザー登録エラー:", error);
      const errorMessage = error instanceof Error ? error.message : "ユーザー登録に失敗しました";
      setFlash(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                企業ユーザー登録
              </h1>
              <p className="text-gray-600">
                企業を選択してユーザーアカウントを作成し、招待メールを送信します
              </p>
            </div>
            <div>
              <button
                onClick={() => router.push('/admin')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors duration-200 mr-2"
              >
                戻る
              </button>
              <button
                onClick={() => window.location.href = '/api/auth/logout'}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                ログアウト
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {/* 企業選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                企業選択 *
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- 企業を選択してください --</option>
                {companies.map((company) => (
                  <option key={company.companyId} value={company.companyId}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="user@example.com"
                required
              />
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-8 py-3 rounded transition-colors duration-200 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "アカウント作成中..." : "ユーザー登録"}
              </button>
            </div>
          </form>

          {/* フラッシュメッセージ */}
          {flash && (
            <div className={`mt-6 p-4 rounded text-center max-w-2xl mx-auto ${
              flash.includes('✅') 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {flash}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
