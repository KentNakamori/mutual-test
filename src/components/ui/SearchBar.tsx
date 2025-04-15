// components/ui/SearchBar.tsx
import React, { useState, ReactNode } from 'react';
import { Search, Filter, ChevronDown, ArrowUpDown } from 'lucide-react';
import { FilterOption, SearchBarProps } from '@/types';

// 並び替えオプションの型定義
export interface SortOption {
  value: string;
  label: string;
}

// プロパティの拡張
export interface EnhancedSearchBarProps extends SearchBarProps {
  sortOptions?: SortOption[];
  initialSortBy?: string;
  onSort?: (sortBy: string) => void;
}

const SearchBar: React.FC<EnhancedSearchBarProps> = ({
  placeholder = "検索",
  initialKeyword = "",
  initialFilters = {},
  initialSortBy = "",
  showFilterButton = true,
  className = "",
  filterButtonLabel = "ジャンルでフィルター",
  filterOptions = [],
  sortOptions = [],
  filterComponent,
  onSearch,
  onSort
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(initialFilters);
  const [selectedSort, setSelectedSort] = useState(initialSortBy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, selectedFilters);
  };

  const updateFilter = (key: string, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSortSelect = (sortValue: string) => {
    setSelectedSort(sortValue);
    setShowSortOptions(false);
    // sortValue は "createdAt_desc" などとなるので分解して selectedFilters に反映
    const [sortKey, sortDirection] = sortValue.split('_');
    setSelectedFilters(prev => ({
       ...prev,
       sortKey,
       sortDirection,
    }));
    if (onSort) {
      onSort(sortValue);
    }
  };

  return (
    // 全体を横並びにし、検索バーは自動拡張（flex-grow）する設定
    <div className={`flex items-center ${className}`}>
      {/* 検索バー：親要素にflex-growを設定 */}
      <div className="relative flex-grow max-w-md">
        <form onSubmit={handleSubmit} className="flex items-center w-full">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={placeholder}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </form>
      </div>

      
      {/* フィルターと並び替えボタンを間隔を空けずに右側に設置 */}
      <div className="flex ml-4 space-x-2">
        {showFilterButton && (
          <div className="relative">
            <button 
              type="button"
              onClick={() => {
                setShowFilters(!showFilters);
                setShowSortOptions(false);
              }}
              className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center">
                <Filter size={16} className="mr-2 text-gray-500" />
                <span>{filterButtonLabel}</span>
              </div>
              <ChevronDown size={16} className="ml-2 text-gray-500" />
            </button>
            
            {showFilters && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-3">フィルター設定</h3>
                  
                  {filterComponent ? (
                    filterComponent
                  ) : (
                    <div className="space-y-3">
                      {filterOptions.map(option => (
                        <div key={option.id} className="flex flex-col">
                          <label className="text-sm font-medium mb-1">{option.label}</label>
                          {option.type === 'select' && option.options && (
                            <select
                              value={selectedFilters[option.id] || ''}
                              onChange={e => updateFilter(option.id, e.target.value)}
                              className="border rounded px-2 py-1.5 text-sm"
                            >
                              <option value="">すべて</option>
                              {option.options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          )}
                          {option.type === 'text' && (
                            <input
                              type="text"
                              value={selectedFilters[option.id] || ''}
                              onChange={e => updateFilter(option.id, e.target.value)}
                              className="border rounded px-2 py-1.5 text-sm"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFilters(false);
                        onSearch(keyword, selectedFilters);
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      適用
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="relative">
          <button 
            type="button"
            onClick={() => {
              setShowSortOptions(!showSortOptions);
              setShowFilters(false);
            }}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>並び替え</span>
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>

          
          {showSortOptions && sortOptions.length > 0 && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSortSelect(option.value)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedSort === option.value 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
