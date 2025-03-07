"use client";

import React from "react";
import Tabs from "../../../../components/ui/Tabs";
import ProfileForm from "./ProfileForm";
import PasswordChangeForm from "./PasswordChangeForm";
import NotificationSettingForm from "./NotificationSettingForm";
import AccountDeleteForm from "./AccountDeleteForm";
import { ProfileData, NotificationSetting } from "@/types";

export interface MyPageTabMenuProps {
  activeTab: "profile" | "password" | "notification" | "delete";
  onChangeTab: (tab: "profile" | "password" | "notification" | "delete") => void;
  profileData: ProfileData;
  onSaveProfile: (updatedProfile: ProfileData) => Promise<void>;
  onChangePassword: (
    currentPass: string,
    newPass: string
  ) => Promise<void>;
  onSaveNotification: (
    newSetting: NotificationSetting
  ) => Promise<void>;
  onDeleteAccount: (password: string) => Promise<void>;
}

const MyPageTabMenu: React.FC<MyPageTabMenuProps> = ({
  activeTab,
  onChangeTab,
  profileData,
  onSaveProfile,
  onChangePassword,
  onSaveNotification,
  onDeleteAccount,
}) => {
  const tabs = [
    {
      id: "profile",
      label: "プロフィール",
      content: (
        <ProfileForm
          initialProfile={profileData}
          onSaveProfile={onSaveProfile}
        />
      ),
    },
    {
      id: "password",
      label: "パスワード変更",
      content: <PasswordChangeForm onChangePassword={onChangePassword} />,
    },
    {
      id: "notification",
      label: "通知設定",
      content: (
        <NotificationSettingForm
          // API未接続時はモックの初期設定としてメールアドレスはプロフィールのものを流用
          initialSetting={{
            enabled: true,
            email: profileData.email,
            frequency: "daily",
          }}
          onSaveSetting={onSaveNotification}
        />
      ),
    },
    {
      id: "delete",
      label: "退会",
      content: <AccountDeleteForm onDeleteAccount={onDeleteAccount} />,
    },
  ];

  return (
    <div>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChangeTab={(tabId: string) =>
          onChangeTab(tabId as "profile" | "password" | "notification" | "delete")
        }
      />
    </div>
  );
};

export default MyPageTabMenu;
