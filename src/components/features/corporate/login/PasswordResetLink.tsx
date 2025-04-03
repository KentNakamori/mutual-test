//src\components\features\corporate\login\PasswordResetLink.tsx

import React from 'react';
import Link from 'next/link';
import { PasswordResetLinkProps } from "@/types";


/**
 * PasswordResetLink
 * 「パスワードをお忘れの方はこちら」というリンクを表示します。
 */
const PasswordResetLink: React.FC<PasswordResetLinkProps> = ({ href }) => {
  return (
    <div className="mt-4 text-center">
      <Link href={href} className="text-sm text-blue-600 hover:underline">
        パスワードをお忘れの方はこちら
      </Link>
    </div>
  );
};

export default PasswordResetLink;