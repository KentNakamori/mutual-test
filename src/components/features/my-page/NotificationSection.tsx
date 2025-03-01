// src/components/features/my-page/NotificationSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import NotificationSettingForm, {
  NotificationFormValues,
} from "./NotificationSettingForm";

import { useNotificationSetting, useUpdateNotificationSetting } from "@/hooks/useNotificationSetting";
import { NotificationSettingRequest } from "@/types/api/user";

/**
 * 通知設定セクション
 */
const NotificationSection: React.FC = () => {
  const {
    data: notificationData,
    isLoading: isLoadingSetting,
    error: settingError,
  } = useNotificationSetting();

  const {
    mutate: mutateSetting,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateNotificationSetting();

  const [successMsg, setSuccessMsg] = useState("");

  const handleSaveSetting = (formValues: NotificationFormValues) => {
    setSuccessMsg("");

    const payload: NotificationSettingRequest = {
      notifyOnNewQA: formValues.notifyOnNewQA,
      notifyOnFollowUpdate: formValues.notifyOnFollowUpdate,
      notificationEmail: formValues.notificationEmail,
      frequency: formValues.frequency,
    };
    mutateSetting(payload, {
      onSuccess: (data) => {
        setSuccessMsg("通知設定を更新しました。");
      },
    });
  };

  const errorMessage =
    settingError instanceof Error ? settingError.message : null;
  const updateErrMessage =
    updateError instanceof Error ? updateError.message : null;

  if (errorMessage) {
    return (
      <div className="text-red-600">
        通知設定の取得に失敗: {errorMessage}
      </div>
    );
  }

  if (isLoadingSetting) {
    return <div className="text-gray-600">読み込み中...</div>;
  }

  if (!notificationData) {
    return <div>設定情報がありません</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">通知設定</h2>

      {updateErrMessage && (
        <div className="bg-error text-error p-2 mb-4 rounded">
          {updateErrMessage}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 text-green-600 p-2 mb-4 rounded">
          {successMsg}
        </div>
      )}

      {/* フォーム */}
      <NotificationSettingForm
        initialValues={{
          notifyOnNewQA: notificationData.notifyOnNewQA,
          notifyOnFollowUpdate: notificationData.notifyOnFollowUpdate,
          notificationEmail: notificationData.notificationEmail || "",
          frequency: notificationData.frequency,
        }}
        onSubmit={handleSaveSetting}
        loading={isUpdating}
      />
    </div>
  );
};

export default NotificationSection;
