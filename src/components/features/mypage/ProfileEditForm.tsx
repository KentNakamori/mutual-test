"use client";

import React, { useState } from "react";
import { UserProfileFormProps } from "@/types/components/features";

/**
 * プロフィール編集フォーム
 * - 入力欄: 名前, メール, アバターURL, 自己紹介
 */
const ProfileEditForm: React.FC<UserProfileFormProps> = ({
  userData,
  onSave,
  isSaving,
  errorMessage,
}) => {
  const [formData, setFormData] = useState(userData);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 名前 */}
      <div>
        <label className="text-sm font-medium block mb-1">名前</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* メール */}
      <div>
        <label className="text-sm font-medium block mb-1">メールアドレス</label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>

      {/* アバターURL */}
      <div>
        <label className="text-sm font-medium block mb-1">アバターURL</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.avatarUrl || ""}
          onChange={(e) => handleChange("avatarUrl", e.target.value)}
        />
      </div>

      {/* 自己紹介 */}
      <div>
        <label className="text-sm font-medium block mb-1">自己紹介</label>
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.introduction || ""}
          onChange={(e) => handleChange("introduction", e.target.value)}
        />
      </div>

      {errorMessage && <p className="text-error">{errorMessage}</p>}

      <button
        type="submit"
        className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors duration-200"
        disabled={isSaving}
      >
        {isSaving ? "保存中..." : "保存する"}
      </button>
    </form>
  );
};

export default ProfileEditForm;
