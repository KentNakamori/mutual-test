"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // AuthContextを利用している例

/**
 * LoginForm
 * - メールアドレスとパスワードの入力欄 + ログインボタン
 */
export default function LoginForm() {
  const router = useRouter();
  const { handleLogin, isLoading } = useAuth();

  // ローカルステート
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // (モック用) バックエンド非接続時に成功扱いするデモフラグ
  // 実運用では不要
  const [simulateNoBackend, setSimulateNoBackend] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // モック動作
    if (simulateNoBackend) {
      console.log("【Mockモード】バックエンド非接続のため擬似ログインします。");
      // 1秒待ってから成功扱い
      setTimeout(() => {
        router.push("/");
      }, 1000);
      return;
    }

    try {
      await handleLogin(email, password);
      // ログイン成功後、トップページへ遷移など
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "ログインに失敗しました");
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={onSubmit} className="bg-gray-50 p-4 rounded border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">ログイン</h2>

        {/* メールアドレス */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* パスワード */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* エラー表示 */}
        {errorMsg && (
          <p className="text-sm text-error mb-2">
            {errorMsg}
          </p>
        )}

        {/* ログインボタン */}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-black/90 active:scale-95 transition-all duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "ログイン中..." : "ログイン"}
        </button>

        {/* Mockモード切り替え(任意) */}
        <div className="mt-4 flex items-center space-x-2 text-sm">
          <input
            id="mockSwitch"
            type="checkbox"
            checked={simulateNoBackend}
            onChange={(e) => setSimulateNoBackend(e.target.checked)}
            className="h-4 w-4 text-black border-gray-300"
          />
          <label htmlFor="mockSwitch" className="cursor-pointer">
            バックエンド接続なしで擬似成功
          </label>
        </div>
      </form>
    </div>
  );
}
