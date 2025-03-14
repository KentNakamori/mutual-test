//src\app\investor\mypage\page.tsx
"use client";

import React, { useState } from "react";
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/Footer";
import MyPageTabMenu from "@/components/features/investor/mypage/MyPageTabMenu";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileData, NotificationSetting } from "@/types";

// モックデータ（API接続不可時用）
const MOCK_PROFILE: ProfileData = {
  userId: "mock-001",
  displayName: "Mock User",
  email: "mock@example.com",
  investorType: "individual",
  bio: "This is a mock profile for testing purposes.",
};

// サイドバーのメニュー項目
const menuItems = [
  { label: 'マイページ', link: '/investor/mypage' },
  { label: 'Q&A', link: '/investor/qa' },
  { label: 'チャットログ', link: '/investor/chat-logs' },
  { label: '企業一覧', link: '/investor/companies' },
];

const MyPage = () => {
  const { userProfile, isLoading, error, refetch } = useUserProfile();
  const profile: ProfileData = userProfile || MOCK_PROFILE;

  const [activeTab, setActiveTab] = useState<"profile" | "password" | "notification" | "delete">("profile");

  const handleSaveProfile = async (updatedProfile: ProfileData) => {
    console.log("Saving profile", updatedProfile);
    await refetch();
  };

  const handleChangePassword = async (currentPass: string, newPass: string) => {
    console.log("Changing password", currentPass, newPass);
  };

  const handleSaveNotification = async (newSetting: NotificationSetting) => {
    console.log("Saving notification settings", newSetting);
  };

  const handleDeleteAccount = async (password: string) => {
    const confirmed = window.confirm("本当に退会しますか？ この操作は取り消せません。");
    if (!confirmed) return;
    console.log("Deleting account with password", password);
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー削除 → サイドバーに置き換え */}
      <div className="flex flex-1">
        <Sidebar
          isCollapsible
          menuItems={menuItems}
          selectedItem="/investor/mypage"
          onSelectMenuItem={(link) => (window.location.href = link)}
        />
        <main className="flex-1 container mx-auto p-4">
          <h1 className="text-2xl font-semibold mb-4">マイページ</h1>
          <MyPageTabMenu
            activeTab={activeTab}
            onChangeTab={(tab) => setActiveTab(tab as typeof activeTab)}
            profileData={profile}
            onSaveProfile={handleSaveProfile}
            onChangePassword={handleChangePassword}
            onSaveNotification={handleSaveNotification}
            onDeleteAccount={handleDeleteAccount}
          />
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: "利用規約", href: "/terms" },
          { label: "プライバシーポリシー", href: "/privacy" },
        ]}
        copyrightText="MyApp Inc."
        onSelectLink={(href) => (window.location.href = href)}
      />
    </div>
  );
};

export default MyPage;
