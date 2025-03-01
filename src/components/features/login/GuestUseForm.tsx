"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * GuestUseForm
 * - ゲスト利用のための利用規約同意チェック + ゲストログイン処理
 */
export default function GuestUseForm() {
  const router = useRouter();
  const { handleGuestLogin, isLoading } = useAuth();

  const [agreed, setAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // (モック用) バックエンド非接続時に成功扱いする例
  const [simulateNoBackend, setSimulateNoBackend] = useState(false);

  const onGuestLogin = async () => {
    if (!agreed) {
      setErrorMsg("利用規約に同意が必要です。");
      return;
    }
    setErrorMsg(null);

    if (simulateNoBackend) {
      console.log("【Mockモード】ゲストログインを擬似成功にします。");
      // 1秒後にトップへ遷移
      setTimeout(() => {
        router.push("/");
      }, 1000);
      return;
    }

    try {
      await handleGuestLogin();
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "ゲストログインに失敗しました。");
    }
  };

  return (
    <div className="mb-8 bg-gray-50 p-4 rounded border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">ゲスト利用</h2>

      {/* チェックボックス (規約同意) */}
      <div className="flex items-center mb-4">
        <input
          id="agree"
          type="checkbox"
          className="h-4 w-4 text-black border-gray-300"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <label htmlFor="agree" className="ml-2 text-sm text-gray-700 cursor-pointer">
          利用規約に同意します
        </label>
      </div>

      {/* エラー表示 */}
      {errorMsg && (
        <p className="text-sm text-error mb-2">
          {errorMsg}
        </p>
      )}

      {/* ゲスト利用ボタン */}
      <button
        type="button"
        onClick={onGuestLogin}
        className="bg-black text-white px-4 py-2 rounded hover:bg-black/90 active:scale-95 transition-all duration-200 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "処理中..." : "ゲスト利用する"}
      </button>

      {/* Mockモード */}
      <div className="mt-4 flex items-center space-x-2 text-sm">
        <input
          id="mockSwitchGuest"
          type="checkbox"
          checked={simulateNoBackend}
          onChange={(e) => setSimulateNoBackend(e.target.checked)}
          className="h-4 w-4 text-black border-gray-300"
        />
        <label htmlFor="mockSwitchGuest" className="cursor-pointer">
          バックエンド接続なしで擬似成功
        </label>
      </div>
    </div>
  );
}
