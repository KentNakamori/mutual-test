// components/ui/Button.tsx
import React from 'react';

export interface ButtonProps {
  /** ボタンに表示するテキスト */
  label: string;
  /** クリック時のハンドラ */
  onClick?: () => void;
  /** 無効状態フラグ */
  disabled?: boolean;
  /** ボタンのバリアント（primary: 黒背景＋白文字、destructive: 赤系など） */
  variant?: 'primary' | 'destructive' | 'outline' | 'link';
}

/**
 * Button コンポーネント
 * Tailwind CSSのユーティリティとshadcn UIの考え方に基づいて、
 * 主にアクション操作に利用するボタンを実装します。
 */
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
}) => {
  const baseClasses =
    "py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  let variantClasses = "";

  switch (variant) {
    case 'primary':
      variantClasses = "bg-black text-white hover:bg-gray-800";
      break;
    case 'destructive':
      variantClasses = "bg-red-600 text-white hover:bg-red-700";
      break;
    case 'outline':
      variantClasses = "border border-gray-300 text-black hover:bg-gray-100";
      break;
    case 'link':
      variantClasses = "text-blue-600 hover:underline";
      break;
    default:
      variantClasses = "bg-black text-white hover:bg-gray-800";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};

export default Button;
