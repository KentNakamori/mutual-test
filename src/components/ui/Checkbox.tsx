// components/ui/Checkbox.tsx
import React from 'react';
import{ CheckboxProps} from '@/types';



/**
 * Checkbox コンポーネント
 * チェックボックスとラベルを表示します。
 */
const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <label className={`flex items-center space-x-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
      />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
