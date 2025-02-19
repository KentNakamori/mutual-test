"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const { handleLogin, isLoading } = useAuth(); // AuthContextからログイン関数などを取得

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("メールアドレスとパスワードを入力してください。");
      return;
    }

    try {
      await handleLogin(email, password);
      // ログイン成功時、必要に応じて画面遷移
      router.push("/");
    } catch (err: any) {
      // APIエラー時など
      setErrorMsg(err.message || "ログインに失敗しました。");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* メールアドレス */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          メールアドレス
        </label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* パスワード */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          パスワード
        </label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* エラー表示 */}
      {errorMsg && (
        <p className="text-sm text-error mt-1">{errorMsg}</p>
      )}

      {/* ログインボタン */}
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
}
