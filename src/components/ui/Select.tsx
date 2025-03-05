// components/ui/Select.tsx
import React from 'react';

export interface Option {
  label: string;
  value: string;
}

export interface SelectProps {
  /** 選択肢リスト */
  options: Option[];
  /** 現在選択されている値 */
  value: string;
  /** 選択変更時のハンドラ */
  onChange: (value: string) => void;
  /** 無効状態 */
  disabled?: boolean;
}

/**
 * Select コンポーネント
 * 基本的なドロップダウンを実装します。
 */
const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200 bg-white"
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

export default Select;
