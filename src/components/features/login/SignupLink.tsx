"use client";

import React from "react";
import Link from "next/link";

interface SignupLinkProps {
  href: string;
}

export default function SignupLink({ href }: SignupLinkProps) {
  return (
    <div className="text-center">
      <Link
        href={href}
        className="text-sm text-gray-700 underline hover:text-gray-900"
      >
        新規登録はこちら
      </Link>
    </div>
  );
}
