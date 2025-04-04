// components/ui/Input.tsx
import React from 'react';
import{ InputProps} from '@/types';



/**
 * Input コンポーネント
 * Tailwind CSS と shadcn UI の考え方を元に、基本的な入力欄を実装します。
 */
const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  errorState = false,
}) => {
  const baseClasses =
    "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  const errorClasses = errorState
    ? "border-red-600 focus:ring-red-600"
    : "border-gray-300 focus:ring-black";

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseClasses} ${errorClasses} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
  );
};

export default Input;
