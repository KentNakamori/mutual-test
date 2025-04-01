// src/components/features/corporate/qa/SearchForm.tsx
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FaFilter, FaSortAmountDown } from 'react-icons/fa';

export interface SearchFormProps {
  initialQuery?: string;
  onSearch: (params: { query: string; filter?: string; sortOrder?: 'asc' | 'desc' }) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ initialQuery = '', onSearch }) => {
  const [query, setQuery] = useState(initialQuery);
  // 新規追加：フィルター条件用の状態
  const [filterOption, setFilterOption] = useState('');
  // 新規追加：昇降順用の状態（初期は昇順）
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  // ポップアップ表示の制御用
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [isSortPopupOpen, setIsSortPopupOpen] = useState(false);

  const handleSearchClick = () => {
    onSearch({ query, filter: filterOption, sortOrder });
  };

  const toggleFilterPopup = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
    if (isSortPopupOpen) setIsSortPopupOpen(false);
  };

  const toggleSortPopup = () => {
    setIsSortPopupOpen(!isSortPopupOpen);
    if (isFilterPopupOpen) setIsFilterPopupOpen(false);
  };

  return (
    <div className="relative flex items-center space-x-2">
      <Input value={query} onChange={setQuery} placeholder="検索キーワード" />
      <Button label="検索" onClick={handleSearchClick} />
      <button onClick={toggleFilterPopup} className="p-2 border rounded hover:bg-gray-200">
        <FaFilter size={20} />
      </button>
      <button onClick={toggleSortPopup} className="p-2 border rounded hover:bg-gray-200">
        <FaSortAmountDown size={20} />
      </button>

      {/* フィルター設定のポップアップ */}
      {isFilterPopupOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white p-4 border rounded shadow-lg z-10">
          <h4 className="text-sm font-semibold mb-2">フィルター設定</h4>
          <Input
            value={filterOption}
            onChange={setFilterOption}
            placeholder="フィルター条件を入力"
          />
          <div className="flex justify-end mt-2">
            <Button label="適用" onClick={() => { setIsFilterPopupOpen(false); handleSearchClick(); }} variant="primary" />
          </div>
        </div>
      )}

      {/* 昇降順設定のポップアップ */}
      {isSortPopupOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white p-4 border rounded shadow-lg z-10">
          <h4 className="text-sm font-semibold mb-2">並び順設定</h4>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => { setSortOrder('asc'); setIsSortPopupOpen(false); handleSearchClick(); }}
              className="text-sm text-gray-700 hover:underline"
            >
              昇順
            </button>
            <button
              onClick={() => { setSortOrder('desc'); setIsSortPopupOpen(false); handleSearchClick(); }}
              className="text-sm text-gray-700 hover:underline"
            >
              降順
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
