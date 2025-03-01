// src/app/my-page/page.tsx
"use client";

/**
 * @file page.tsx
 * @description マイページのメインページ (Next.js 13+)
 * - ログイン済みユーザー向け
 * - MyPageLayout + 各セクション(Profile, Password, Notification, AccountDelete)を組み込み
 */

import React, { useState, useEffect } from "react";
import MyPageLayout, { MyPageTabKey } from "@/components/features/my-page/MyPageLayout";
import ProfileSection from "@/components/features/my-page/ProfileSection";
import PasswordSection from "@/components/features/my-page/PasswordSection";
import NotificationSection from "@/components/features/my-page/NotificationSection";
import AccountDeleteSection from "@/components/features/my-page/AccountDeleteSection";

// もしAuthContextでログイン状態チェックするなら import { useAuth } from "@/hooks/useAuth";

export default function MyPage() {
  // もしログイン必須ページなら useAuth() 等でチェックも可能
  // const { user, isAuthenticated } = useAuth();
  // if (!isAuthenticated) { ... }

  const [activeTab, setActiveTab] = useState<MyPageTabKey>("profile");

  return (
    <MyPageLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabContents={{
        profile: <ProfileSection />,
        password: <PasswordSection />,
        notification: <NotificationSection />,
        accountDelete: <AccountDeleteSection />,
      }}
    />
  );
}
