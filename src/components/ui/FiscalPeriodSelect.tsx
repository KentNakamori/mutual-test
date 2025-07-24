import React from 'react';
import { parseFiscalPeriod, createFiscalPeriod } from './qaUtils';

interface FiscalPeriodSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  includeEmpty?: boolean;
}

export const FiscalPeriodSelect: React.FC<FiscalPeriodSelectProps> = ({
  value,
  onChange,
  className = '',
  includeEmpty = false
}) => {
  // 現在の選択値を分解
  const { year, month, quarter } = parseFiscalPeriod(value);

  // 年度入力時の処理
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = e.target.value;
    if (!newYear) {
      onChange('');
      return;
    }
    onChange(createFiscalPeriod(newYear, month, quarter));
  };

  // 月入力時の処理
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value;
    if (!year) {
      onChange('');
      return;
    }
    onChange(createFiscalPeriod(year, newMonth, quarter));
  };

  // 四半期入力時の処理
  const handleQuarterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuarter = e.target.value;
    if (!year) {
      onChange('');
      return;
    }
    onChange(createFiscalPeriod(year, month, newQuarter));
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={year || ''}
          onChange={handleYearChange}
          placeholder="年度"
          className="w-20 px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="1900"
          max="2100"
        />
        <span className="text-gray-600">年</span>
      </div>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={month || ''}
          onChange={handleMonthChange}
          placeholder="月"
          className="w-16 px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="1"
          max="12"
        />
        <span className="text-gray-600">月期</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-gray-600">Q</span>
        <input
          type="number"
          value={quarter || ''}
          onChange={handleQuarterChange}
          placeholder="Q"
          className="w-16 px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="1"
          max="4"
        />
      </div>
    </div>
  );
};

export default FiscalPeriodSelect; 