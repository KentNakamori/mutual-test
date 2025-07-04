// components/ui/SearchBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { EnhancedSearchBarProps } from '@/types';
import { getTagColor } from '@/components/ui/tagConfig';

const SearchBar: React.FC<EnhancedSearchBarProps> = ({
  placeholder = "検索",
  initialKeyword = "",
  initialFilters = {},
  initialSortBy = "",
  showFilterButton = true,
  className = "",
  filterButtonLabel = "フィルター",
  filterOptions = [],
  sortOptions = [
    { value: "createdAt_desc", label: "作成日（新しい順）" },
    { value: "createdAt_asc", label: "作成日（古い順）" },
    { value: "likeCount_desc", label: "いいね数（多い順）" },
    { value: "likeCount_asc", label: "いいね数（少ない順）" }
  ],
  filterComponent,
  onSearch,
  onSort,
  additionalButtons
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(initialFilters);
  const [selectedSort, setSelectedSort] = useState(initialSortBy);

  // フィルター要素のref
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // フィルター外クリックでフィルターを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // フィルターの外側をクリックした場合
      if (showFilters && filterRef.current && !filterRef.current.contains(target)) {
        setShowFilters(false);
      }
      
      // ソートの外側をクリックした場合
      if (showSortOptions && sortRef.current && !sortRef.current.contains(target)) {
        setShowSortOptions(false);
      }
    };

    // ドキュメントにイベントリスナーを追加
    document.addEventListener('click', handleClickOutside);
    
    // クリーンアップ関数
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showFilters, showSortOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFilters = Object.entries(selectedFilters).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    console.log('検索条件:', {
      keyword,
      filters: cleanFilters,
      sort: selectedSort
    });
    onSearch(keyword, cleanFilters);
  };

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...selectedFilters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    console.log('SearchBar - updateFilter:', { key, value, newFilters });
    setSelectedFilters(newFilters);
  };

  const removeFilter = (key: string, value: string) => {
    const newFilters = { ...selectedFilters };
    if (newFilters[key] === value) {
      delete newFilters[key];
    }
    setSelectedFilters(newFilters);
  };

  const handleSortSelect = (sortValue: string) => {
    setSelectedSort(sortValue);
    setShowSortOptions(false);
    const [sortKey, sortDirection] = sortValue.split('_') as [string, 'asc' | 'desc'];
    setSelectedFilters(prev => ({
      ...prev,
      sort: sortValue,
      order: sortDirection
    }));
    onSearch(keyword, { ...selectedFilters, sort: sortValue, order: sortDirection });
    if (onSort) {
      onSort(sortValue);
    }
  };

  const getFilterLabel = (key: string, value: string) => {
    const option = filterOptions.find(opt => opt.id === key);
    if (!option) return value;
    const selectedOption = option.options?.find(opt => opt.value === value);
    return selectedOption?.label || value;
  };

  const getFilterColor = (key: string, value: string) => {
    const option = filterOptions.find(opt => opt.id === key);
    if (!option) return 'bg-gray-100 text-gray-800';
    const selectedOption = option.options?.find(opt => opt.value === value);
    return selectedOption ? getTagColor(selectedOption.label) : 'bg-gray-100 text-gray-800';
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    const cleanFilters = Object.entries(selectedFilters).reduce((acc, [key, value]) => {
      if (value) {
        //カテゴリのみ配列として扱う
        if (key === 'category') {
          acc[key] = Array.isArray(value) ? value : [value];
        } else if (key === 'reviewStatus') {
          // ステータスフィルタを適切に処理
          acc[key] = value;
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Record<string, any>);
    console.log('SearchBar - handleApplyFilters:', { cleanFilters });
    setActiveFilters(cleanFilters);
    onSearch(keyword, cleanFilters);
  };

  const handleResetFilters = () => {
    setSelectedFilters({});
    setActiveFilters({});
    setKeyword('');
    setSelectedSort('');
    onSearch('', {});
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className="flex items-center">
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

        <div className="flex ml-4 space-x-2">
          {showFilterButton && (
            <div className="relative" ref={filterRef}>
              <button 
                type="button"
                onClick={() => {
                  setShowFilters(!showFilters);
                  setShowSortOptions(false);
                }}
                className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center">
                  <Filter size={16} className="mr-2 text-gray-500" />
                  <span>{filterButtonLabel}</span>
                </div>
                <ChevronDown size={16} className="ml-2 text-gray-500" />
              </button>
              
              {showFilters && (
                <div 
                  className="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-[60]"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="p-4">
                    <h3 className="text-sm font-medium mb-3">フィルター設定</h3>
                    
                    {filterComponent ? (
                      filterComponent
                    ) : (
                      <div className="space-y-4">
                        {filterOptions
                          .sort((a, b) => {
                            // カテゴリを最初に表示
                            if (a.id === 'category') return -1;
                            if (b.id === 'category') return 1;
                            return 0;
                          })
                          .map(option => {
                            const isMultiSelect = option.id === 'category';
                            const isSingleSelect = option.id === 'tag' || option.id === 'fiscalPeriod';
                            
                            return (
                              <div key={option.id} className="flex flex-col">
                                <label className="text-sm font-medium mb-2">{option.label}</label>
                                {isMultiSelect ? (
                                  <div className="flex flex-wrap gap-2">
                                    {option.options?.map(opt => {
                                      const isSelected = Array.isArray(selectedFilters[option.id])
                                        ? selectedFilters[option.id].includes(opt.value)
                                        : false;
                                      return (
                                        <button
                                          key={opt.value}
                                          onClick={() => {
                                            const currentValues = Array.isArray(selectedFilters[option.id])
                                              ? selectedFilters[option.id]
                                              : [];
                                            if (isSelected) {
                                              updateFilter(option.id, currentValues.filter((v: string) => v !== opt.value));
                                            } else {
                                              updateFilter(option.id, [...currentValues, opt.value]);
                                            }
                                          }}
                                          className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                                            isSelected 
                                              ? 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200' 
                                              : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                                          }`}
                                        >
                                          {opt.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : option.id === 'fiscalPeriod' ? (
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        value={selectedFilters[option.id]?.split('-Q')[0] || ''}
                                        onChange={(e) => {
                                          const year = e.target.value;
                                          const quarter = selectedFilters[option.id]?.split('-Q')[1] || '';
                                          if (!year) {
                                            updateFilter(option.id, '');
                                          } else {
                                            updateFilter(option.id, quarter ? `${year}-Q${quarter}` : year);
                                          }
                                        }}
                                        placeholder="年度"
                                        className="w-20 px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1900"
                                        max="2100"
                                      />
                                      <span className="text-gray-600">年度</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-gray-600">Q</span>
                                      <input
                                        type="number"
                                        value={selectedFilters[option.id]?.split('-Q')[1] || ''}
                                        onChange={(e) => {
                                          const year = selectedFilters[option.id]?.split('-Q')[0] || '';
                                          const quarter = e.target.value;
                                          if (!year) {
                                            updateFilter(option.id, '');
                                          } else {
                                            updateFilter(option.id, quarter ? `${year}-Q${quarter}` : year);
                                          }
                                        }}
                                        placeholder="Q"
                                        className="w-16 px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                        max="99"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <select
                                    value={selectedFilters[option.id] || ''}
                                    onChange={(e) => updateFilter(option.id, e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="">すべて</option>
                                    {option.options?.map(opt => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                      >
                        リセット
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyFilters}
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
          
          <div className="relative" ref={sortRef}>
            <button 
              type="button"
              onClick={() => {
                setShowSortOptions(!showSortOptions);
                setShowFilters(false);
              }}
              className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>並び替え</span>
              <ChevronDown size={16} className="ml-2 text-gray-500" />
            </button>

            {showSortOptions && sortOptions.length > 0 && (
              <div 
                className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[60]"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
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
          
          {/* 追加ボタンを表示 */}
          {additionalButtons && additionalButtons}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
