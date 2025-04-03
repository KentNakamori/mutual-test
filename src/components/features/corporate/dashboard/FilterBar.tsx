// src/components/features/corporate/dashboard/FilterBar.tsx
import React, { useState } from "react";
import Select from "@/components/ui/Select";
import { Filter, Period, FilterBarProps } from "@/types";


/**
 * FilterBar コンポーネント
 * 集計期間と種別の選択フォームを提供し、フィルタ変更時に親へ通知します。
 */
const FilterBar: React.FC<FilterBarProps> = ({ initialFilter, onFilterChange }) => {
  const [localFilter, setLocalFilter] = useState<Filter>(initialFilter);

  const handlePeriodChange = (value: string) => {
    // value を Period 型にキャスト
    const newFilter: Filter = { ...localFilter, period: value as Period };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const periodOptions = [
    { label: "日別", value: "daily" },
    { label: "週別", value: "weekly" },
    { label: "月別", value: "monthly" },
  ];

  return (
    <div className="flex items-end space-x-4 mb-6">
      <div className="flex-1">
        <label className="block mb-1 text-sm font-medium">期間</label>
        <Select options={periodOptions} value={localFilter.period} onChange={handlePeriodChange} />
      </div>
    </div>
  );
};

export default FilterBar;
