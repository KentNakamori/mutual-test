/**
 * Selectコンポーネント
 * - shadcnのSelectをラップし、オプション配列やラベル、エラー表示などをサポート
 */

import * as React from "react";
import {
  Select as ShadcnSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/shadcn/select"; 
// ↑ 実際のshadcn Select実装へのパスを調整してください

import { cn } from "@/libs/utils";

type Option = {
  label: string;
  value: string;
};

export type CustomSelectProps = {
  /** セレクトボックスのオプション配列 */
  options: Option[];
  /** 現在の選択値 */
  value: string;
  /** 選択値が変化したときのコールバック */
  onChange: (value: string) => void;
  /** ラベル */
  label?: string;
  /** エラー文言 */
  errorMessage?: string;
  /** プレースホルダ（初期表示） */
  placeholder?: string;
};

/**
 * プロジェクト用 Select
 */
const Select: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  label,
  errorMessage,
  placeholder,
}) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <ShadcnSelect
        value={value}
        onValueChange={(val) => onChange(val)}
      >
        <SelectTrigger
          className={cn(
            "bg-white border text-gray-700 focus:ring-black focus:border-black w-full",
            errorMessage && "border-red-600"
          )}
        >
          <SelectValue placeholder={placeholder || "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>

      {/* エラー表示 */}
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default Select;
