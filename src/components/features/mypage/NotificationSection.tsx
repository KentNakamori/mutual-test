"use client";

import React, { useEffect, useState } from "react";
import { getNotificationSetting, updateNotificationSetting } from "@/libs/api";
import NotificationSettingForm from "./NotificationSettingForm";
import { NotificationSettingResponse } from "@/types/api/user";
import { Nullable } from "@/types/utilities";

/**
 * 通知設定セクション
 * - APIから通知設定を取得/更新する
 */
const NotificationSection: React.FC = () => {
  const [setting, setSetting] = useState<Nullable<NotificationSettingResponse>>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 初期表示時に通知設定を取得
    getNotificationSetting()
      .then((res) => setSetting(res))
      .catch((err) => setError(err.message || "Failed to load notification settings"));
  }, []);

  const handleSave = async (updatedSetting: NotificationSettingResponse) => {
    setIsSaving(true);
    setError("");
    try {
      const result = await updateNotificationSetting(updatedSetting);
      setSetting(result);
    } catch (err: any) {
      setError(err.message || "Failed to update notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">通知設定</h2>
      {error && <p className="text-error">{error}</p>}

      {setting ? (
        <NotificationSettingForm
          currentSetting={setting}
          onSave={handleSave}
          isSaving={isSaving}
        />
      ) : (
        <p>読み込み中...</p>
      )}
    </div>
  );
};

export default NotificationSection;
