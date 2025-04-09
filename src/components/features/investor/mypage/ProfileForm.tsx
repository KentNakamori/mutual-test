// src/components/features/investor/mypage/ProfileForm.tsx
"use client";

import React, { useState } from "react";
import { ProfileData } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { ProfileFormProps } from "@/types";

const investorTypeOptions = [
  { label: '機関投資家', value: '機関投資家' },
  { label: '個人投資家', value: '個人投資家' },
  { label: 'アナリスト', value: 'アナリスト' },
  { label: 'その他', value: 'その他' },
];

const assetManagementScaleOptions = [
  { label: '500万円未満', value: '500万円未満' },
  { label: '500万～1000万円', value: '500万～1000万円' },
  { label: '1000万～3000万', value: '1000万～3000万' },
  { label: '3000万円以上', value: '3000万円以上' },
];

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialProfile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<ProfileData>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile(formData);
      alert("プロフィールが更新されました。");
    } catch (error) {
      alert("プロフィール更新に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">表示名</label>
        <Input
          value={formData.displayName}
          onChange={(value) => handleChange("displayName", value)}
          placeholder="表示名"
        />
      </div>
      <div>
        <label className="block mb-1">メールアドレス</label>
        <Input
          value={formData.email}
          onChange={(value) => handleChange("email", value)}
          placeholder="メールアドレス"
          type="email"
        />
      </div>
      <div>
        <label className="block mb-1">投資家種別</label>
        <Select
          options={investorTypeOptions}
          value={formData.investorType || ""}
          onChange={(value) => handleChange("investorType", value)}
        />
      </div>
      <div>
        <label className="block mb-1">資産運用規模</label>
        <Select
          options={assetManagementScaleOptions}
          value={formData.assetManagementScale || ""}
          onChange={(value) => handleChange("assetManagementScale", value)}
        />
      </div>
      <div>
        <label className="block mb-1">自己紹介</label>
        <Input
          value={formData.bio || ""}
          onChange={(value) => handleChange("bio", value)}
          placeholder="自己紹介"
        />
      </div>
      <div>
        <Button
          type="submit"
          label={isSaving ? "保存中..." : "保存する"}
          disabled={isSaving}
        />
      </div>
    </form>
  );
};

export default ProfileForm;
