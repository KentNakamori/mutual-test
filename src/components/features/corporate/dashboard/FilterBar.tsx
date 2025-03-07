// src/components/features/corporate/dashboard/FilterBar.tsx
import React, { useState } from "react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface Filter {
  period: string;
  type: string;
}

interface FilterBarProps {
  initialFilter: Filter;
  onFilterChange: (newFilter: Filter) => void;
}

/**
 * FilterBar コンポーネント
 * 集計期間と種別の選択フォームを提供し、フィルタ変更時に親へ通知します。
 */
const FilterBar: React.FC<FilterBarProps> = ({ initialFilter, onFilterChange }) => {
  const [localFilter, setLocalFilter] = useState<Filter>(initialFilter);

  const handlePeriodChange = (value: string) => {
    setLocalFilter((prev) => ({ ...prev, period: value }));
  };

  const handleTypeChange = (value: string) => {
    setLocalFilter((prev) => ({ ...prev, type: value }));
  };

  const applyFilter = () => {
    onFilterChange(localFilter);
  };

  const periodOptions = [
    { label: "日別", value: "daily" },
    { label: "週別", value: "weekly" },
    { label: "月別", value: "monthly" },
  ];

  const typeOptions = [
    { label: "全体", value: "all" },
    { label: "アクセス数", value: "access" },
    { label: "チャット質問数", value: "chat" },
  ];

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex-1">
        <label className="block mb-1 text-sm font-medium">期間</label>
        <Select options={periodOptions} value={localFilter.period} onChange={handlePeriodChange} />
      </div>
      <div className="flex-1">
        <label className="block mb-1 text-sm font-medium">種別</label>
        <Select options={typeOptions} value={localFilter.type} onChange={handleTypeChange} />
      </div>
      <div>
        <Button label="変更を適用" onClick={applyFilter} />
      </div>
    </div>
  );
};

export default FilterBar;
