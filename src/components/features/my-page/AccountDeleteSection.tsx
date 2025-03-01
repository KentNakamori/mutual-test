// src/components/features/my-page/AccountDeleteSection.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import AccountDeletionModal from "./AccountDeletionModal";

import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import {
  DeleteAccountRequest,
  DeleteAccountResponse,
} from "@/types/api/user";

/**
 * 退会手続きセクション
 */
const AccountDeleteSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate: deleteAccount, isLoading, error } = useDeleteAccount();

  const [successMsg, setSuccessMsg] = useState("");

  const handleOpen = () => {
    setModalOpen(true);
    setSuccessMsg("");
  };
  const handleClose = () => {
    setModalOpen(false);
  };

  /** 退会モーダルで「削除」確定したとき */
  const handleConfirmDelete = (password: string, reason?: string) => {
    setSuccessMsg("");
    const payload: DeleteAccountRequest = {
      confirmPassword: password,
      reason,
    };
    deleteAccount(payload, {
      onSuccess: (data: DeleteAccountResponse) => {
        setSuccessMsg("アカウントを削除しました。");
      },
      onError: (err) => {
        console.log("退会API失敗:", err);
      },
    });
  };

  const errorMsg = error instanceof Error ? error.message : null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">アカウント退会</h2>
      <p className="text-sm text-gray-600 mb-4">
        退会するとすべてのデータが削除されます。よろしいですか？
      </p>

      {errorMsg && (
        <div className="bg-error text-error p-2 mb-4 rounded">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 text-green-600 p-2 mb-4 rounded">
          {successMsg}
        </div>
      )}

      <Button variant="destructive" onClick={handleOpen} disabled={isLoading}>
        退会する
      </Button>

      {/* 確認モーダル */}
      <AccountDeletionModal
        isOpen={modalOpen}
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
        isProcessing={isLoading}
      />
    </div>
  );
};

export default AccountDeleteSection;
