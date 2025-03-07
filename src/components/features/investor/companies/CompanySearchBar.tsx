// src/components/features/investor/companies/CompanySearchBar.tsx
import React, { useState } from 'react';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';

export interface CompanySearchQuery {
  keyword: string;
  industry?: string;
}

export interface CompanySearchBarProps {
  initialQuery: CompanySearchQuery;
  onSearchChange: (query: CompanySearchQuery) => void;
}

/**
 * CompanySearchBar コンポーネント
 * ── 企業名のキーワード検索と業種フィルタを提供し、
 *     ユーザーの入力内容を親コンポーネントに通知します。
 */
const CompanySearchBar: React.FC<CompanySearchBarProps> = ({ initialQuery, onSearchChange }) => {
  const [keyword, setKeyword] = useState(initialQuery.keyword);
  const [industry, setIndustry] = useState(initialQuery.industry || '');

  // 業種選択用のオプション（日本語）
  const industryOptions = [
    { label: '全ての業種', value: '' },
    { label: 'テクノロジー', value: 'テクノロジー' },
    { label: 'エネルギー', value: 'エネルギー' },
    { label: 'ヘルスケア', value: 'ヘルスケア' },
  ];

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange({ keyword, industry });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
      <div className="flex-1 mb-4 md:mb-0">
        <Input value={keyword} onChange={setKeyword} placeholder="企業名で検索…" />
      </div>
      <div className="mb-4 md:mb-0">
        <Select options={industryOptions} value={industry} onChange={setIndustry} />
      </div>
      <button type="submit" className="py-2 px-4 rounded bg-black text-white hover:bg-gray-800">
        検索
      </button>
    </form>
  );
};

export default CompanySearchBar;
