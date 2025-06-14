// src/components/features/investor/mypage/ProfileForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ProfileData } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { ProfileFormProps } from "@/types";

// 投資家タイプのオプション
const investorTypeOptions = [
  { label: '機関投資家', value: '機関投資家' },
  { label: '個人投資家', value: '個人投資家' },
  { label: 'セルサイドアナリスト', value: 'セルサイドアナリスト' },
  { label: 'その他', value: 'その他' },
];

// 資産管理規模のオプション
const assetScaleOptions = [
  { label: '500万円未満', value: '500万円未満' },
  { label: '500万円～1000万円', value: '500万円～1000万円' },
  { label: '1000万円～5000万円', value: '1000万円～5000万円' },
  { label: '5000万円～1億円', value: '5000万円～1億円' },
  { label: '1億円以上', value: '1億円以上' },
  { label: '非開示', value: '非開示' },
];

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialProfile,
  onSaveProfile,
}) => {
  // 初期プロファイルをそのまま使用（デフォルト値は設定しない）
  const [formData, setFormData] = useState<ProfileData>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 初期プロファイルが変更された場合にフォームデータを更新
  useEffect(() => {
    setFormData(initialProfile);
  }, [initialProfile]);

  // フィールド変更ハンドラ
  const handleChange = (field: keyof ProfileData, value: string) => {
    console.log(`フィールド「${field}」を更新: "${value}"`);
    setFormData((prev) => ({ ...prev, [field]: value }));
    // エラーや成功メッセージをクリア
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("送信するプロフィールデータ:", formData);
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      await onSaveProfile(formData);
      setSuccessMessage("プロフィールが正常に更新されました");
    } catch (error) {
      console.error("プロフィール更新エラー:", error);
      setErrorMessage(error instanceof Error ? error.message : "プロフィール更新に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 成功メッセージ */}
      {successMessage && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      
      {/* エラーメッセージ */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}
      
      {/* 表示名 - 一旦非表示 */}
      {/* <div>
        <label className="block mb-1">表示名</label>
        <Input
          value={formData.display_name || ''}
          onChange={(value) => handleChange("display_name", value)}
          placeholder="表示名"
        />
      </div> */}
      <div>
        <label className="block mb-1">メールアドレス</label>
        <Input
          value={formData.email || ''}
          onChange={(value) => handleChange("email", value)}
          placeholder="メールアドレス"
          type="email"
          disabled={true} // メールアドレスは変更不可に設定
        />
        <p className="text-xs text-gray-500 mt-1">メールアドレスは変更できません</p>
      </div>
      <div>
        <label className="block mb-1">投資家種別</label>
        <Select
          options={investorTypeOptions}
          value={formData.investor_type|| ""}
          onChange={(value) => handleChange("investor_type", value)}
        />
      </div>
      <div>
        <label className="block mb-1">資産運用規模</label>
        <Select
          options={assetScaleOptions}
          value={formData.asset_scale || ""}
          onChange={(value) => handleChange("asset_scale", value)}
        />
      </div>
      {/* 自己紹介 - 一旦非表示 */}
      {/* <div>
        <label className="block mb-1">自己紹介</label>
        <Input
          value={formData.bio || ""}
          onChange={(value) => handleChange("bio", value)}
          placeholder="自己紹介"
        />
      </div> */}
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
