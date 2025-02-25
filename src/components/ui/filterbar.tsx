import React, { useState } from "react";
import { Select } from "./select";
import { Input } from "./input";
import { Button } from "./button";

type FilterItem = {
  type: "select" | "checkbox" | "radio" | "input";
  label: string;
  name: string;
  options?: { label: string; value: string | number }[];
};

type FilterBarProps = {
  filters: FilterItem[];  // required
  onFilterChange: (updated: Record<string, any>) => void;
  onReset?: () => void;
  layout?: "horizontal" | "vertical";
  compact?: boolean;
};

const FilterBar: React.FC<FilterBarProps> = ({
  filters = [],  // デフォルト値を設定
  onFilterChange,
  onReset,
  layout = "horizontal",
  compact = false,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});

  // filtersが未定義またはemptyの場合の早期リターン
  if (!filters || filters.length === 0) {
    return null;
  }

  const handleChange = (name: string, value: any) => {
    const updated = { ...selectedFilters, [name]: value };
    setSelectedFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    setSelectedFilters({});
    if (onReset) onReset();
  };

  const containerClasses = layout === "horizontal" 
    ? "flex items-center space-x-4" 
    : "flex flex-col space-y-4";
  const labelClass = compact ? "text-sm" : "text-base";

  return (
    <div className="border p-4 rounded-md">
      <div className={containerClasses}>
        {filters.map((filter) => {
          const currentVal = selectedFilters[filter.name] ?? "";
          return (
            <div key={filter.name} className="flex flex-col">
              <label className={`${labelClass} font-semibold mb-1`}>
                {filter.label}
              </label>
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
                  onChange={(e) => handleChange(filter.name, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>

      {onReset && (
        <Button
          onClick={handleReset}
          variant="outline"
          className="mt-2"
        >
          リセット
        </Button>
      )}
    </div>
  );
};

export default FilterBar;