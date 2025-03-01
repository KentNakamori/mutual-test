// src/components/features/my-page/ProfileSection.tsx
"use client";

import React, { useEffect } from "react";
import ProfileEditForm, { ProfileFormValues } from "./ProfileEditForm";

import { useMyProfile, useUpdateMyProfile } from "@/hooks/useUserProfile";
import { UpdateUserProfileRequest } from "@/types/api/user";

/**
 * プロフィール表示・編集セクション
 * - React Queryで MyProfile を取得
 * - ProfileEditForm で編集→ useUpdateMyProfile で更新
 */
const ProfileSection: React.FC = () => {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useMyProfile();

  const {
    mutate: updateProfile,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateMyProfile();

  /** フォーム送信時 */
  const handleSaveProfile = (formValues: ProfileFormValues) => {
    const payload: UpdateUserProfileRequest = {
      name: formValues.userName,
      email: formValues.email,
      avatarUrl: formValues.avatarUrl,
      introduction: formValues.introduction,
    };
    updateProfile(payload);
  };

  if (profileError) {
    return (
      <div className="text-sm text-red-600">
        プロフィール取得に失敗しました: {profileError.message}
      </div>
    );
  }

  // ロード中
  if (isProfileLoading) {
    return <div className="text-sm text-gray-500">読み込み中...</div>;
  }

  // プロフィールデータが未取得
  if (!profileData) {
    return <div className="text-sm text-gray-500">データがありません</div>;
  }

  // エラーがあれば
  const saveErrorMsg =
    updateError instanceof Error ? updateError.message : null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">プロフィール</h2>

      {saveErrorMsg && (
        <div className="bg-error text-error p-2 mb-4 rounded">
          {saveErrorMsg}
        </div>
      )}

      {/* フォーム */}
      <ProfileEditForm
        initialValues={{
          userName: profileData.name,
          email: profileData.email,
          avatarUrl: profileData.avatarUrl,
          introduction: profileData.introduction || "",
        }}
        onSave={handleSaveProfile}
        loading={isUpdating}
      />
    </div>
  );
};

export default ProfileSection;
