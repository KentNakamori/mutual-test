// src/components/features/investor//mypage/AccountDeleteForm.tsx
"use client";

import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import Button from '../../../ui/Button';
import Checkbox from '../../../ui/Checkbox';

const AccountDeleteForm: React.FC = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>("");

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      setMessage('退会する前に同意してください。');
      setMessageType('error');
      return;
    }

    if (!user) {
      setMessage('ユーザー情報が取得できません。');
      setMessageType('error');
      return;
    }

    // 最終確認
    const finalConfirm = window.confirm(
      '本当にアカウントを削除しますか？\n\nこの操作は取り消すことができません。\nアカウント情報および関連データは完全に削除されます。'
    );

    if (!finalConfirm) {
      return;
    }

    setIsDeleting(true);
    setMessage("");
    setMessageType("");

    try {
      // Auth0のアカウント削除APIをproxy経由で呼び出し
      const response = await fetch('/api/proxy/investor/account/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage('アカウントが削除されました。ログアウトします...');
        setMessageType('success');
        
        // 少し待ってからログアウトページにリダイレクト
        setTimeout(() => {
          window.location.href = '/api/auth/logout';
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'アカウント削除に失敗しました。');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      setMessage('アカウント削除に失敗しました。');
      setMessageType('error');
    } finally {
      setIsDeleting(false);
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
          Auth0アカウント削除について
        </h3>
        <p className="text-blue-700 text-sm mb-3">
          アカウント削除はAuth0のManagement APIを通じて安全に実行されます。
        </p>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• アカウント情報および関連データは完全に削除されます</li>
          <li>• この操作は取り消すことができません</li>
          <li>• 削除後は自動的にログアウトされます</li>
          <li>• 同じメールアドレスで再度アカウントを作成することは可能です</li>
        </ul>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="text-red-800 font-medium mb-2">⚠️ 重要な注意事項</h4>
        <ul className="text-red-700 text-sm space-y-1">
          <li>• 退会するとアカウント情報および関連データは完全に削除され、元に戻せません</li>
          <li>• 進行中の取引やチャット履歴も全て削除されます</li>
          <li>• 削除前に必要なデータのバックアップを取ることをお勧めします</li>
        </ul>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          現在のアカウント
        </label>
        <div className="text-sm text-gray-600">
          <p><strong>メールアドレス:</strong> {user.email}</p>
          <p><strong>ユーザーID:</strong> {user.sub}</p>
        </div>
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

      <form onSubmit={handleDelete} className="space-y-4">
        <div>
          <Checkbox 
            checked={agreed}
            onChange={setAgreed}
            label="上記の注意事項を理解し、アカウント削除に同意します"
          />
        </div>
        
        <div>
          <Button 
            type="submit"
            label={isDeleting ? "削除処理中..." : "アカウントを削除する"}
            variant="destructive"
            disabled={isDeleting || !agreed}
          />
        </div>
      </form>

      <div className="text-xs text-gray-500 space-y-1">
        <p>※ アカウント削除後は、全てのサービスへのアクセスが不可能になります。</p>
        <p>※ ソーシャルログイン（Google、Facebook等）をご利用の場合も、Auth0上のアカウントが削除されます。</p>
      </div>
    </div>
  );
};

export default AccountDeleteForm;
