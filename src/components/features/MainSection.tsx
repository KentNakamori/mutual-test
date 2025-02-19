"use client";

import React from "react";
import LoginForm from "@/components/features/login/LoginForm";
import GuestUseForm from "@/components/features/login/GuestUseForm";
import SignupLink from "@/components/features/login/SignupLink";

export default function MainSection() {
  return (
    <main className="flex-grow">
      <div className="max-w-md mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold leading-relaxed mb-6">
          ログイン
        </h1>

        {/* ログインフォーム */}
        <div className="mb-6">
          <LoginForm />
        </div>

        {/* ゲスト利用フォーム */}
        <div className="mb-6">
          <GuestUseForm />
        </div>

        {/* 新規登録導線 */}
        <div className="mt-4">
          <SignupLink href="/signup" />
        </div>
      </div>
    </main>
  );
}
