//src\components\features\investor\mypage\PasswordChangeForm.tsx
"use client";

import React, { useState } from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import { PasswordChangeFormProps} from "../../../../types";



const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onChangePassword,
}) => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmNewPass) {
      alert("新しいパスワードが一致しません。");
      return;
    }
    setIsChanging(true);
    try {
      await onChangePassword(currentPass, newPass);
      alert("パスワードが変更されました。");
      setCurrentPass("");
      setNewPass("");
      setConfirmNewPass("");
    } catch (error) {
      alert("パスワード変更に失敗しました。");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">現在のパスワード</label>
        <Input
          value={currentPass}
          onChange={setCurrentPass}
          type="password"
          placeholder="現在のパスワード"
        />
      </div>
      <div>
        <label className="block mb-1">新しいパスワード</label>
        <Input
          value={newPass}
          onChange={setNewPass}
          type="password"
          placeholder="新しいパスワード"
        />
      </div>
      <div>
        <label className="block mb-1">新しいパスワード（確認）</label>
        <Input
          value={confirmNewPass}
          onChange={setConfirmNewPass}
          type="password"
          placeholder="新しいパスワード（確認）"
        />
      </div>
      <div>
        <Button
          type="submit"
          label={isChanging ? "変更中..." : "変更する"}
          disabled={isChanging}
        />
      </div>
    </form>
  );
};

export default PasswordChangeForm;
