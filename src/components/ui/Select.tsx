// components/ui/Select.tsx
import React from 'react';
import{ Option, SelectProps} from '@/types';

/**
 * Select コンポーネント
 * 基本的なドロップダウンを実装します。
 */
const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <select
      className={`w-full px-3 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

export default Select;
