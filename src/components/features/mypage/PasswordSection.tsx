"use client";

import React, { useState } from "react";
import { changePassword } from "@/libs/api";
import PasswordChangeForm from "./PasswordChangeForm";

/**
 * パスワード変更セクション
 * - 親コンポーネントでAPI呼び出しを行う例
 */
const PasswordSection: React.FC = () => {
  const [error, setError] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setIsChanging(true);
    setError("");
    try {
      await changePassword({ currentPassword, newPassword });
      alert("パスワードを変更しました");
    } catch (err: any) {
      setError(err.message || "パスワード変更に失敗しました");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">パスワード変更</h2>
      <PasswordChangeForm
        onChangePassword={handleChangePassword}
        isChanging={isChanging}
        errorMessage={error}
      />
    </div>
  );
};

export default PasswordSection;
