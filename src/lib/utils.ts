/**
 * @file lib/utils.ts
 * @description Tailwindのクラス名を合成するための便利関数などをまとめたユーティリティ
 */

import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * shadcn UI で推奨されているクラス名合成関数。
 *  - clsx で条件付きクラスの判定を行い、重複や優先度を tailwind-merge で整理。
 * @example
 *   cn("p-2 text-white", isError && "bg-red-500", classNameFromProps)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
