"use client";

import React, { useState } from "react";
import AccountDeletionModal from "./AccountDeletionModal";

const AccountDeleteSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleConfirmDeletion = (confirmPassword: string, reason?: string) => {
    // 退会API呼び出しなど
    // ここではモーダルを閉じるだけのサンプル実装
    alert(`アカウント削除リクエスト: パスワード=${confirmPassword}, 理由=${reason}`);
    setModalOpen(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">アカウント削除</h2>
      <p className="text-sm text-gray-600 mb-4">
        アカウントを削除すると、すべてのデータが完全に消去されます。この操作は取り消せません。
      </p>
      <button
        onClick={handleOpenModal}
        className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors duration-200"
      >
        アカウントを削除
      </button>

      <AccountDeletionModal
        isOpen={modalOpen}
        onConfirm={handleConfirmDeletion}
        onCancel={handleCancel}
        // 実際にはAPI呼び出し中フラグなどを渡す
        isProcessing={false}
        errorMessage=""
      />
    </div>
  );
};

export default AccountDeleteSection;
