// src/components/features/my-page/NotificationSettingForm.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Switch } from "@/components/ui/shadcn/switch";
import { Select } from "@/components/ui/shadcn/select";

export type NotificationFormValues = {
  notifyOnNewQA: boolean;
  notifyOnFollowUpdate: boolean;
  notificationEmail: string;
  frequency: string; // "immediate" | "daily" | "weekly" など
};

type NotificationSettingFormProps = {
  initialValues: NotificationFormValues;
  onSubmit: (values: NotificationFormValues) => void;
  loading?: boolean;
};

/**
 * 通知設定フォーム
 */
const NotificationSettingForm: React.FC<NotificationSettingFormProps> = ({
  initialValues,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState<NotificationFormValues>(
    initialValues
  );

  const handleSwitch = (key: keyof NotificationFormValues, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {/* 新着QA通知 */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.notifyOnNewQA}
          onCheckedChange={(checked) => handleSwitch("notifyOnNewQA", checked)}
          id="switch-newQA"
          disabled={loading}
        />
        <label htmlFor="switch-newQA" className="text-sm">
          新着QA通知を受け取る
        </label>
      </div>

      {/* フォロー企業更新通知 */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.notifyOnFollowUpdate}
          onCheckedChange={(checked) =>
            handleSwitch("notifyOnFollowUpdate", checked)
          }
          id="switch-follow"
          disabled={loading}
        />
        <label htmlFor="switch-follow" className="text-sm">
          フォロー企業更新通知を受け取る
        </label>
      </div>

      {/* 通知先メール */}
      <div>
        <label className="block text-sm font-medium mb-1">
          通知用メールアドレス
        </label>
        <Input
          name="notificationEmail"
          type="email"
          value={formData.notificationEmail}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      {/* 受信頻度 */}
      <div>
        <label className="block text-sm font-medium mb-1">受信頻度</label>
        <Select
          value={formData.frequency}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, frequency: val }))
          }
          options={[
            { value: "immediate", label: "即時" },
            { value: "daily", label: "1日1回" },
            { value: "weekly", label: "週1回" },
          ]}
          placeholder="選択してください"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "保存中..." : "保存"}
      </Button>
    </form>
  );
};

export default NotificationSettingForm;
