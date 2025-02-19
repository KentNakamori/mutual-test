"use client";

import React, { useState } from "react";
import { PasswordChangeFormProps } from "@/types/components/features";

/**
 * パスワード変更フォーム
 */
const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onChangePassword,
  isChanging,
  errorMessage,
}) => {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onChangePassword(currentPwd, newPwd);
    setCurrentPwd("");
    setNewPwd("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">現在のパスワード</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={currentPwd}
          onChange={(e) => setCurrentPwd(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">新しいパスワード</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
        />
      </div>

      {errorMessage && <p className="text-error">{errorMessage}</p>}

      <button
        type="submit"
        className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors duration-200"
        disabled={isChanging}
      >
        {isChanging ? "変更中..." : "変更する"}
      </button>
    </form>
  );
};

export default PasswordChangeForm;
