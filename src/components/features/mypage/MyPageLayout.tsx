"use client";

import React, { useState } from "react";
import TabMenu from "./TabMenu";
import ProfileSection from "./ProfileSection";
import PasswordSection from "./PasswordSection";
import NotificationSection from "./NotificationSection";
import AccountDeleteSection from "./AccountDeleteSection";

/**
 * マイページ全体のレイアウトコンポーネント
 * - タブ切り替えで各セクションを表示
 */
const MyPageLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "notification" | "delete">(
    "profile"
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">マイページ</h1>

      {/* タブメニュー */}
      <TabMenu activeTab={activeTab} onChangeTab={setActiveTab} />

      <div className="mt-6">
        {activeTab === "profile" && <ProfileSection />}
        {activeTab === "password" && <PasswordSection />}
        {activeTab === "notification" && <NotificationSection />}
        {activeTab === "delete" && <AccountDeleteSection />}
      </div>
    </div>
  );
};

export default MyPageLayout;
