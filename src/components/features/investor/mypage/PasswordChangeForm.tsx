//src\components\features\investor\mypage\PasswordChangeForm.tsx
"use client";

import React, { useState } from "react";
import { useUser } from '@auth0/nextjs-auth0';
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

const PasswordChangeForm: React.FC = () => {
  const { user, isLoading } = useUser();
  const [isRequesting, setIsRequesting] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>("");

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setMessage("ユーザー情報が取得できません。");
      setMessageType("error");
      return;
    }

    setIsRequesting(true);
    setMessage("");
    setMessageType("");

    try {
      // Auth0のパスワードリセットAPIを直接呼び出し
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      if (response.ok) {
        setMessage("パスワードリセットメールを送信しました。メールをご確認ください。");
        setMessageType("success");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "パスワードリセットの送信に失敗しました。");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setMessage("パスワードリセットの送信に失敗しました。");
      setMessageType("error");
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="text-center text-red-600">
          ログインが必要です。
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          Auth0パスワード変更について
        </h3>
        <p className="text-blue-700 text-sm mb-3">
          セキュリティのため、パスワード変更はメール経由で行います。
          下記のボタンをクリックすると、パスワードリセット用のメールが送信されます。
        </p>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• メール内のリンクをクリックしてパスワードを変更してください</li>
          <li>• リンクは1時間有効です</li>
          <li>• メールが届かない場合は、迷惑メールフォルダもご確認ください</li>
        </ul>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          現在のメールアドレス
        </label>
        <Input
          value={user.email || ""}
          onChange={() => {}} // 読み取り専用
          type="email"
          placeholder="メールアドレス"
          disabled={true}
          className="bg-gray-50"
        />
      </div>

      {message && (
        <div className={`p-3 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div>
        <Button
          type="button"
          label={isRequesting ? "送信中..." : "パスワードリセットメールを送信"}
          onClick={handlePasswordReset}
          disabled={isRequesting}
        />
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>※ パスワード変更後は、全てのデバイスで再ログインが必要になります。</p>
        <p>※ ソーシャルログイン（Google、Facebook等）をご利用の場合は、各プロバイダーでパスワードを変更してください。</p>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
