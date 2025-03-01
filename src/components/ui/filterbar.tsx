/**
 * FilterBarコンポーネント
 * - 一覧画面などで使用する複数のフィルタ項目(業種、フォロー中のみ、並び替えなど)をまとめて設定するUI
 * - 下記は最小限の例です。プロジェクトに合わせて拡張してください。
 */

import React from "react";

// フィルタ1つぶんの定義例 (typeや構造は自由に拡張可能)
type FilterItem = {
  key: string;                  // "industry" / "followed" / "sort" etc
  label: string;                // "業種" / "フォローのみ" など
  type: "select" | "checkbox";  // UI種類 (例)
  options?: string[];           // Selectの場合の候補
  value?: string | boolean;     // 選択値
};

export type FilterBarProps = {
  /** フィルタ項目の配列 */
  filters: FilterItem[];
  /** フィルタが変更されたら呼ばれるコールバック */
  onFilterChange: (updatedFilters: FilterItem[]) => void;
  /** フィルタをリセット(全部クリア)などしたい場合、オプションでボタンを表示 */
  onReset?: () => void;
  /** レイアウトを水平 or 垂直に切り替えたい場合など */
  layout?: "horizontal" | "vertical";
};

/**
 * FilterBar
 */
const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  layout = "horizontal",
}) => {
  // フィルタ変更時
  const handleChange = (
    filterKey: string,
    newValue: string | boolean
  ) => {
    const updated = filters.map((f) => {
      if (f.key === filterKey) {
        return { ...f, value: newValue };
      }
      return f;
    });
    onFilterChange(updated);
  };

  return (
    <div
      className={
        layout === "horizontal" ? "flex items-center space-x-4" : "space-y-4"
      }
    >
      {filters.map((filter) => {
        if (filter.type === "select") {
          return (
            <div key={filter.key} className="flex items-center space-x-2">
              <label className="text-sm text-gray-700">{filter.label}:</label>
              <select
                className="border border-gray-300 rounded p-1 text-sm focus:ring-black focus:border-black"
                value={typeof filter.value === "string" ? filter.value : ""}
                onChange={(e) => handleChange(filter.key, e.target.value)}
              >
                <option value="">-- 選択 --</option>
                {filter.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (filter.type === "checkbox") {
          return (
            <div key={filter.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-black border-gray-300"
                checked={filter.value === true}
                onChange={(e) => handleChange(filter.key, e.target.checked)}
              />
              <label className="text-sm text-gray-700">{filter.label}</label>
            </div>
          );
        }

        return null; // 他typeがあれば拡張
      })}

      {onReset && (
        <button
          onClick={onReset}
          className="ml-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default FilterBar;
