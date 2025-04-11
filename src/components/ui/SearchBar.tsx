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
  buttonLabel = "検索",
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
    if (onSort) {
      onSort(sortValue);
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm mb-6 ${className}`}>
      <div className="flex justify-between items-center">
        {/* 検索バー - 幅を半分に */}
        <div className="relative w-80">
          <form onSubmit={handleSubmit} className="flex items-center">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={placeholder}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {buttonLabel}
            </button>
          </form>
        </div>
        
        {/* フィルターと並び替えボタン */}
        <div className="flex space-x-3">
          {showFilterButton && (
            <div className="relative">
              <button 
                type="button"
                onClick={() => {
                  setShowFilters(!showFilters);
                  setShowSortOptions(false);
                }}
                className="flex items-center space-x-1 bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium"
              >
                <Filter size={16} />
                <span>{filterButtonLabel}</span>
                <ChevronDown size={16} />
              </button>
              
              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
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
          
          {/* 並び替えボタン */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => {
                setShowSortOptions(!showSortOptions);
                setShowFilters(false);
              }}
              className="flex items-center space-x-1 bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium"
            >
              <ArrowUpDown size={16} />
              <span>並び替え</span>
              <ChevronDown size={16} />
            </button>
            
            {showSortOptions && sortOptions.length > 0 && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
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
    </div>
  );
};

export default SearchBar;