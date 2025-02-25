"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // AuthContextを利用するフック
import SimpleHeader from "@/components/features/login/SimpleHeader";
import SimpleFooter from "@/components/features/login/SimpleFooter";
import MainSection from "@/components/features/login/MainSection";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // もし認証済みなら、トップページなどへリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/top");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      {/* シンプルヘッダー */}
      <SimpleHeader />

      {/* メインセクション */}
      <MainSection />

      {/* フッター */}
      <SimpleFooter />
    </div>
  );
}
