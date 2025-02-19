"use client";

import React, { useState } from "react";
import { AccountDeletionModalProps } from "@/types/components/features";

/**
 * 退会(アカウント削除)確認用モーダル
 */
const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isProcessing,
  errorMessage,
}) => {
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password, reason);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-modal
      role="dialog"
    >
      <div className="bg-white w-full max-w-md rounded p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">アカウント削除の確認</h3>
        <p className="text-sm text-gray-600 mb-4">
          本当に削除しますか？ この操作は取り消せません。
        </p>

        {errorMessage && <p className="text-error mb-2">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">
              現在のパスワード
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              削除理由 (任意)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="border border-gray-300 text-gray-600 py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200"
              disabled={isProcessing}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors duration-200"
              disabled={isProcessing}
            >
              {isProcessing ? "処理中..." : "削除する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountDeletionModal;
