"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function GuestUseForm() {
  const router = useRouter();
  const { handleGuestLogin, isLoading } = useAuth();

  const [agreed, setAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onClickGuestUse = async () => {
    setErrorMsg(null);

    if (!agreed) {
      setErrorMsg("ゲスト利用には規約への同意が必要です。");
      return;
    }

    try {
      await handleGuestLogin();
      // 成功後にトップページへ移動など
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "ゲスト利用に失敗しました。");
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded">
      <h2 className="text-lg font-semibold mb-2">ゲストで試してみる</h2>
      <label className="flex items-center mb-2 cursor-pointer text-sm text-gray-700">
        <input
          type="checkbox"
          className="mr-2"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          disabled={isLoading}
        />
        利用規約に同意する
      </label>

      {errorMsg && (
        <p className="text-sm text-error mb-2">{errorMsg}</p>
      )}

      <button
        type="button"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
        disabled={isLoading}
        onClick={onClickGuestUse}
      >
        {isLoading ? "処理中..." : "ゲスト利用はこちら"}
      </button>
    </div>
  );
}
