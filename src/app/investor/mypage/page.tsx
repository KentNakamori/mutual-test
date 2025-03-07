"use client";

import React, { useState } from "react";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import MyPageTabMenu from "../../../components/features/investor/mypage/MyPageTabMenu";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { ProfileData, NotificationSetting } from "../../../types";

// モックデータ（API接続不可時用）
// ※実際の型に合わせて適宜フィールドを追加してください
const MOCK_PROFILE: ProfileData = {
  userId: "mock-001",
  displayName: "Mock User",
  email: "mock@example.com",
  investorType: "individual",
  bio: "This is a mock profile for testing purposes.",
};

const MyPage = () => {
  // プロフィール取得用のカスタムフック
  const { userProfile, isLoading, error, refetch } = useUserProfile();
  
  // API接続エラー時はモックデータを利用
  const profile: ProfileData = userProfile || MOCK_PROFILE;
  
  // タブ状態：'profile'（プロフィール）、'password'（パスワード変更）、'notification'（通知設定）、'delete'（退会）
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "notification" | "delete"
  >("profile");
  
  // 各種ハンドラ（API連携部分は適宜実装）
  const handleSaveProfile = async (updatedProfile: ProfileData) => {
    console.log("Saving profile", updatedProfile);
    // API連携の実装（失敗時はエラーハンドリング）  
    // 接続不可の場合はモックでも更新内容を反映させる処理にするなど
    await refetch();
  };

  const handleChangePassword = async (
    currentPass: string,
    newPass: string
  ) => {
    console.log("Changing password", currentPass, newPass);
    // API連携実装（モックの場合はログ出力のみ）
  };

  const handleSaveNotification = async (newSetting: NotificationSetting) => {
    console.log("Saving notification settings", newSetting);
    // API連携実装（モックの場合はログ出力のみ）
  };

  const handleDeleteAccount = async (password: string) => {
    const confirmed = window.confirm(
      "本当に退会しますか？ この操作は取り消せません。"
    );
    if (!confirmed) return;
    console.log("Deleting account with password", password);
    // API連携実装（モックの場合はログ出力のみ）
  };

  // ローディング状態は、API接続状態にかかわらず一定時間表示
  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  // ヘッダー用ナビゲーション例
  const headerLinks = [
    { label: "ホーム", href: "/" },
    { label: "マイページ", href: "/investor/mypage" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        navigationLinks={headerLinks}
        userStatus={{ isLoggedIn: true, userName: profile.displayName }}
        onClickLogo={() => (window.location.href = "/")}
      />
      <main className="flex-1 container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">マイページ</h1>
        <MyPageTabMenu
          activeTab={activeTab}
          onChangeTab={(tab) =>
            setActiveTab(tab as "profile" | "password" | "notification" | "delete")
          }
          profileData={profile}
          onSaveProfile={handleSaveProfile}
          onChangePassword={handleChangePassword}
          onSaveNotification={handleSaveNotification}
          onDeleteAccount={handleDeleteAccount}
        />
      </main>
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
