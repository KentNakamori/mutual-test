"use client";

import React, { useState } from "react";
import { ProfileData } from "@/types";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

export interface ProfileFormProps {
  initialProfile: ProfileData;
  onSaveProfile: (updatedProfile: ProfileData) => Promise<void>;
}

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
