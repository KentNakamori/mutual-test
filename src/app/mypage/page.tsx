"use client";

import React from "react";
import MyPageLayout from "@/components/features/mypage/MyPageLayout";

/**
 * マイページ (ユーザー自身のプロフィール・設定管理)
 *
 * - 本ファイルは Client Component として動作
 * - SSRではなくCSRでデータを取得する想定
 */
export default function MyPagePage() {
  return <MyPageLayout />;
}
