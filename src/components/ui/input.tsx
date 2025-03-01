/**
 * Inputコンポーネント
 * - shadcnのInputをラップし、プロジェクト固有のバリアントやエラーメッセージ表示をサポート
 */

import * as React from "react";
import { Input as ShadcnInput } from "@/components/ui/shadcn/input"; 
// ↑ 実際のshadcn Input実装へのパスを調整してください

import { cn } from "@/libs/utils";

export type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** ラベル文字列 */
  label?: string;
  /** エラー文言 (表示したい場合に設定) */
  errorMessage?: string;
  /** インラインのHelperText(補足説明など) */
  helperText?: string;
};

/**
 * プロジェクト用 Input
 */
const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    { label, errorMessage, helperText, className, ...props },
    ref
  ) => {
    return (
      <div className="w-full mb-4">
        {/* ラベル */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        {/* Input本体 (shadcnのInput) */}
        <ShadcnInput
          ref={ref}
          className={cn(
            "bg-white text-gray-700 focus:ring-black focus:border-black",
            errorMessage && "border-red-600",
            className
          )}
          {...props}
        />

        {/* エラー or 補足説明 */}
        {errorMessage ? (
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        ) : (
          helperText && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
          )
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
