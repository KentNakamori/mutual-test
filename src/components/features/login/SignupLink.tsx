"use client";
import React from "react";
import Link from "next/link";

interface SignupLinkProps {
  href: string; // 新規登録画面へのURL
}

/**
 * SignupLink
 * - "新規登録はこちら" へのリンク
 */
export default function SignupLink({ href }: SignupLinkProps) {
  return (
    <div className="text-center">
      <Link
        href={href}
        className="text-sm text-gray-600 hover:underline"
      >
        新規登録はこちら
      </Link>
    </div>
  );
}
