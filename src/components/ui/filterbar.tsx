/**
 * @file components/ui/FilterBar.tsx
 * @description 複数のフィルタ項目をまとめて表示し、選択内容をonFilterChangeで通知
 */
import React, { useState } from "react";
import{ Select} from "./select";
import {Input }from "./input";
import{Button} from "./button";
// shadcnのcheckboxなども適宜import

type FilterItem = {
  type: "select" | "checkbox" | "radio" | "input";
  label: string;
  name: string;
  options?: { label: string; value: string | number }[];
};

type FilterBarProps = {
  filters: FilterItem[];
  onFilterChange: (updated: Record<string, any>) => void;
  onReset?: () => void;
  layout?: "horizontal" | "vertical";
  compact?: boolean;
};

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  layout = "horizontal",
  compact = false,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});

  const handleChange = (name: string, value: any) => {
    const updated = { ...selectedFilters, [name]: value };
    setSelectedFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    setSelectedFilters({});
    if (onReset) onReset();
  };

  const containerClasses = layout === "horizontal" ? "flex items-center space-x-4" : "flex flex-col space-y-4";
  const labelClass = compact ? "text-sm" : "text-base";

  return (
    <div className="border p-4 rounded-md">
      <div className={containerClasses}>
        {filters.map((filter) => {
          const currentVal = selectedFilters[filter.name] ?? "";
          return (
            <div key={filter.name} className="flex flex-col">
              <label className={`${labelClass} font-semibold mb-1`}>{filter.label}</label>
              {filter.type === "select" && (
                <Select
                  options={filter.options || []}
                  value={currentVal}
                  onChange={(val) => handleChange(filter.name, val)}
                />
              )}
              {filter.type === "input" && (
                <Input
                  value={currentVal}
                  onChange={(val) => handleChange(filter.name, val)}
                />
              )}
              {/* ここでcheckboxやradioの実装を省略 (shadcn Checkboxなど) */}
            </div>
          );
        })}
      </div>

      {onReset && (
        <Button
          label="リセット"
          variant="outline"
          onClick={handleReset}
          className="mt-2"
        />
      )}
    </div>
  );
};

export default FilterBar;
