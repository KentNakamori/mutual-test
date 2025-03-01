"use client";
import React from "react";
import LoginForm from "./LoginForm";
import GuestUseForm from "./GuestUseForm";
import SignupLink from "./SignupLink";

/**
 * MainSection
 * - ログインフォーム、ゲスト利用フォーム、SignupLinkをまとめて配置するラッパー
 */
export default function MainSection() {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold leading-relaxed mb-6 text-center">
        ログイン / Guest利用
      </h1>

      {/* ログインフォーム */}
      <LoginForm />

      {/* ゲスト利用フォーム */}
      <GuestUseForm />

      {/* 新規登録ページへのリンク */}
      <SignupLink href="/signup" />
    </div>
  );
}
