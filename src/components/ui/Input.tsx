// components/ui/Input.tsx
import React, { ChangeEvent, InputHTMLAttributes } from 'react';
import { InputProps as BaseInputProps } from '@/types';

// HTMLInputElementの全属性を継承して型を拡張
interface InputProps extends Omit<BaseInputProps, 'onChange'>, 
  Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value' | 'className'> {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  value: string;
  type?: string;
}

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
  className = '',
  ...rest
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
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseClasses} ${errorClasses} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
      {...rest}
    />
  );
};

export default Input;
