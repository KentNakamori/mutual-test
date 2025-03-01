// src/components/features/my-page/PasswordChangeForm.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";

type PasswordChangeFormProps = {
  onSubmit: (currentPass: string, newPass: string) => void;
  loading?: boolean;
};

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onSubmit,
  loading,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!currentPassword || !newPassword || !confirmPass) {
      setLocalError("全ての項目を入力してください");
      return;
    }
    if (newPassword !== confirmPass) {
      setLocalError("新パスワードと確認用が一致しません");
      return;
    }

    onSubmit(currentPassword, newPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {localError && <p className="text-red-600">{localError}</p>}

      {/* 現在のパスワード */}
      <div>
        <label className="block text-sm font-medium mb-1">
          現在のパスワード
        </label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* 新パスワード */}
      <div>
        <label className="block text-sm font-medium mb-1">
          新パスワード
        </label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* 新パスワード(確認) */}
      <div>
        <label className="block text-sm font-medium mb-1">
          新パスワード（確認）
        </label>
        <Input
          type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "更新中..." : "パスワードを変更"}
      </Button>
    </form>
  );
};

export default PasswordChangeForm;
