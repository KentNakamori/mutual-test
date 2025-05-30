// components/ui/Button.tsx
import React, { ButtonHTMLAttributes } from 'react';
import { ButtonProps as BaseButtonProps } from '@/types';

// 型を拡張
interface ButtonProps extends Omit<BaseButtonProps, 'onClick'>,
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type' | 'className'> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
  type = "button",
  className = "",
  isLoading = false,
  ...rest
}) => {
  const baseClasses =
    "py-2 px-4 rounded-xl whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
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
   case 'gradient':
      variantClasses = "bg-gradient-to-r from-[#1CB5E0] to-[#9967EE] text-white hover:opacity-90";
       break;
    default:
      variantClasses = "bg-black text-white hover:bg-gray-800";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...rest}
    >
      {isLoading ? 'Loading...' : label}
    </button>
  );
};

export default Button;
