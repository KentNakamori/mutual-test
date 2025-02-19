"use client";

import React, { useState } from "react";
import { NotificationSettingFormProps } from "@/types/components/features";

/**
 * 通知設定フォーム
 */
const NotificationSettingForm: React.FC<NotificationSettingFormProps> = ({
  currentSetting,
  onSave,
  isSaving,
}) => {
  const [formData, setFormData] = useState(currentSetting);

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 新着QA通知 */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="notifyOnNewQA"
          checked={formData.notifyOnNewQA}
          onChange={(e) => handleChange("notifyOnNewQA", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="notifyOnNewQA" className="text-sm font-medium">
          新着QA通知を受け取る
        </label>
      </div>

      {/* 企業フォロー更新通知 */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="notifyOnFollowUpdate"
          checked={formData.notifyOnFollowUpdate}
          onChange={(e) => handleChange("notifyOnFollowUpdate", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="notifyOnFollowUpdate" className="text-sm font-medium">
          フォロー企業の更新通知を受け取る
        </label>
      </div>

      {/* 通知メールアドレス */}
      <div>
        <label className="text-sm font-medium block mb-1">通知用メールアドレス</label>
        <input
          type="email"
          value={formData.notificationEmail || ""}
          onChange={(e) => handleChange("notificationEmail", e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* 受信頻度 */}
      <div>
        <label className="text-sm font-medium block mb-1">受信頻度</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.frequency}
          onChange={(e) => handleChange("frequency", e.target.value)}
        >
          <option value="immediate">即時</option>
          <option value="daily">1日1回</option>
          <option value="weekly">週1回</option>
        </select>
      </div>

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

export default NotificationSettingForm;
