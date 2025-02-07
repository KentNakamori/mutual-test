'use client'

import React, { useEffect, useState } from 'react';
import type { Investor } from '@/types/models';

interface InvestorSelectProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  className?: string;
}

export const InvestorSelect: React.FC<InvestorSelectProps> = ({
  value,
  onChange,
  className,
}) => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await fetch('/api/v1/investors');
        if (!response.ok) throw new Error('Failed to fetch investors');
        const data = await response.json();
        setInvestors(data.data);
        setError(null);
      } catch (err) {
        setError('投資家情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  if (error) {
    return (
      <div className="text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      disabled={isLoading}
      className={`px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
        className || ''
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <option value="">投資家を選択</option>
      {investors.map((investor) => (
        <option key={investor._id} value={investor._id}>
          {investor.basicInfo.name} ({investor.basicInfo.company})
        </option>
      ))}
    </select>
  );
};

export default InvestorSelect;
