// src/components/features/my-page/ProfileEditForm.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";

export type ProfileFormValues = {
  userName: string;
  email: string;
  avatarUrl?: string;
  introduction?: string;
};

type ProfileEditFormProps = {
  initialValues: ProfileFormValues;
  onSave: (values: ProfileFormValues) => void;
  loading?: boolean;
};

/**
 * プロフィール編集フォーム
 */
const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  initialValues,
  onSave,
  loading,
}) => {
  const [formData, setFormData] = useState<ProfileFormValues>(initialValues);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 本来はアップロード処理
    // ここでは簡易的にローカルURLを表示するのみ
    const tempUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatarUrl: tempUrl }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {/* ユーザー名 */}
      <div>
        <label className="block text-sm font-medium mb-1">ユーザー名</label>
        <Input
          name="userName"
          value={formData.userName}
          onChange={handleInputChange}
          disabled={loading}
        />
      </div>

      {/* メール */}
      <div>
        <label className="block text-sm font-medium mb-1">メールアドレス</label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={loading}
        />
      </div>

      {/* アバター画像 */}
      <div>
        <label className="block text-sm font-medium mb-1">
          プロフィール画像
        </label>
        <div className="flex items-center space-x-4">
          <img
            src={
              formData.avatarUrl ||
              "https://placehold.jp/50x50.png?text=NoAvatar"
            }
            alt="avatar"
            className="w-16 h-16 object-cover rounded border"
          />
          <Input type="file" onChange={handleFileChange} disabled={loading} />
        </div>
      </div>

      {/* 自己紹介 */}
      <div>
        <label className="block text-sm font-medium mb-1">自己紹介</label>
        <textarea
          name="introduction"
          value={formData.introduction || ""}
          onChange={handleInputChange}
          disabled={loading}
          className="w-full h-24 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* 保存ボタン */}
      <div>
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
