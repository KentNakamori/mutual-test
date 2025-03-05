// components/ui/Textarea.tsx
import React from 'react';

export interface TextareaProps {
  /** 入力値 */
  value: string;
  /** 入力値変更時のハンドラ */
  onChange: (value: string) => void;
  /** プレースホルダー */
  placeholder?: string;
  /** 無効状態 */
  disabled?: boolean;
  /** エラー状態 */
  errorState?: boolean;
}

/**
 * Textarea コンポーネント
 * 長文入力欄として使用します。
 */
const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  errorState = false,
}) => {
  const baseClasses =
    "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  const errorClasses = errorState
    ? "border-red-600 focus:ring-red-600"
    : "border-gray-300 focus:ring-black";

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseClasses} ${errorClasses} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      rows={4}
    />
  );
};

export default Textarea;
