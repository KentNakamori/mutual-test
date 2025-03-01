// src/components/features/my-page/PasswordSection.tsx
"use client";

import React, { useState } from "react";
import PasswordChangeForm from "./PasswordChangeForm";
import { useChangePassword } from "@/hooks/useChangePassword";
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/types/api/user";

/**
 * パスワード変更セクション
 * - React QueryのuseChangePasswordでAPI連携
 */
const PasswordSection: React.FC = () => {
  const { mutate: mutatePassword, isLoading, error } = useChangePassword();

  // API成功時 / 失敗時のメッセージ管理用
  const [successMsg, setSuccessMsg] = useState("");

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setSuccessMsg(""); // リセット

    const payload: ChangePasswordRequest = {
      currentPassword,
      newPassword,
    };

    mutatePassword(payload, {
      onSuccess: (data: ChangePasswordResponse) => {
        setSuccessMsg("パスワードを変更しました。");
      },
      onError: (err: Error) => {
        // errorはuseChangePasswordのerrorにも格納される
        console.log("パスワード変更API失敗", err.message);
      },
    });
  };

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">パスワード変更</h2>

      {errorMessage && (
        <div className="bg-error text-error p-2 mb-4 rounded">
          {errorMessage}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-600 p-2 mb-4 rounded">
          {successMsg}
        </div>
      )}

      <PasswordChangeForm onSubmit={handleChangePassword} loading={isLoading} />
    </div>
  );
};

export default PasswordSection;
