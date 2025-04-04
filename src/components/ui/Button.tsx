// components/ui/Button.tsx
import React from 'react';
import { ButtonProps} from '@/types';


const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
  type = "button",
}) => {
  const baseClasses =
    "py-2 px-4 rounded  whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
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
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};

export default Button;
