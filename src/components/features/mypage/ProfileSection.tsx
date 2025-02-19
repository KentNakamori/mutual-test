"use client";

import React, { useEffect, useState } from "react";
import ProfileEditForm from "./ProfileEditForm";
import { getMyProfile, updateMyProfile } from "@/libs/api";
import { UpdateUserProfileRequest, UserProfileResponse } from "@/types/api/user";
import { Nullable } from "@/types/utilities";

/**
 * プロフィール編集セクション
 * - データ取得 & 保存イベントをハンドル
 */
const ProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<Nullable<UserProfileResponse>>(null);
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 初期表示時にプロフィール取得
    getMyProfile()
      .then((res) => {
        setProfile(res);
      })
      .catch((err) => {
        setError(err.message || "Failed to load profile");
      });
  }, []);

  const handleSave = async (updatedData: UpdateUserProfileRequest) => {
    setIsSaving(true);
    setError("");

    try {
      const result = await updateMyProfile(updatedData);
      setProfile(result.profile); // 更新後のプロフィール
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <h2 className="text-xl font-semibold mb-4">プロフィール編集</h2>

      {error && <p className="text-error mb-2">{error}</p>}

      {profile ? (
        <ProfileEditForm
          userData={{
            name: profile.name,
            email: profile.email,
            avatarUrl: profile.avatarUrl,
            introduction: profile.introduction,
          }}
          onSave={handleSave}
          isSaving={isSaving}
          errorMessage={error}
        />
      ) : (
        <p>読み込み中...</p>
      )}
    </div>
  );
};

export default ProfileSection;
