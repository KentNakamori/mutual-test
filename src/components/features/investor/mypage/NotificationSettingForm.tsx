//src\components\features\investor\mypage\NotificationSettingForm.tsx
"use client";

import React, { useState } from "react";
import { NotificationSetting } from "../../../../types";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import Checkbox from "../../../../components/ui/Checkbox";
import Select from "../../../../components/ui/Select";

export interface NotificationSettingFormProps {
  initialSetting: NotificationSetting;
  onSaveSetting: (newSetting: NotificationSetting) => Promise<void>;
}

const NotificationSettingForm: React.FC<NotificationSettingFormProps> = ({
  initialSetting,
  onSaveSetting,
}) => {
  const [formData, setFormData] = useState<NotificationSetting>(initialSetting);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof NotificationSetting, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSetting(formData);
      alert("通知設定が更新されました。");
    } catch (error) {
      alert("通知設定の更新に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  const frequencyOptions = [
    { label: "リアルタイム", value: "realtime" },
    { label: "毎日", value: "daily" },
    { label: "毎週", value: "weekly" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center">
        <Checkbox
          checked={formData.enabled}
          onChange={(checked) => handleChange("enabled", checked)}
          label="通知を有効にする"
        />
      </div>
      {formData.enabled && (
        <>
          <div>
            <label className="block mb-1">通知先メールアドレス</label>
            <Input
              value={formData.email || ""}
              onChange={(value) => handleChange("email", value)}
              placeholder="メールアドレス"
              type="email"
            />
          </div>
          <div>
            <label className="block mb-1">通知頻度</label>
            <Select
              options={frequencyOptions}
              value={formData.frequency || "daily"}
              onChange={(value) => handleChange("frequency", value)}
            />
          </div>
        </>
      )}
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

export default NotificationSettingForm;
