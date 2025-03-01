// src/components/features/my-page/MyPageLayout.tsx
"use client";

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/shadcn/tabs";

/** タブのキー名 */
export type MyPageTabKey =
  | "profile"
  | "password"
  | "notification"
  | "accountDelete";

type MyPageLayoutProps = {
  activeTab: MyPageTabKey;
  onTabChange: (key: MyPageTabKey) => void;
  tabContents: Record<MyPageTabKey, React.ReactNode>;
};

/**
 * マイページ共通レイアウト
 * - shadcnのTabsを使用
 */
const MyPageLayout: React.FC<MyPageLayoutProps> = ({
  activeTab,
  onTabChange,
  tabContents,
}) => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Tabs
        defaultValue={activeTab}
        onValueChange={(val) => onTabChange(val as MyPageTabKey)}
      >
        <TabsList>
          <TabsTrigger value="profile">プロフィール</TabsTrigger>
          <TabsTrigger value="password">パスワード変更</TabsTrigger>
          <TabsTrigger value="notification">通知設定</TabsTrigger>
          <TabsTrigger value="accountDelete">アカウント退会</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="profile">{tabContents.profile}</TabsContent>
          <TabsContent value="password">{tabContents.password}</TabsContent>
          <TabsContent value="notification">{tabContents.notification}</TabsContent>
          <TabsContent value="accountDelete">{tabContents.accountDelete}</TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MyPageLayout;
