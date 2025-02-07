// components/features/chat-board/BoardSection/BoardFilter.tsx
import React from 'react';
import { FilterX } from 'lucide-react';

interface BoardFilterProps {
  categories: string[];
  selectedCategory: string | null;
  sortBy: 'latest' | 'popular';
  onCategoryChange: (category: string | null) => void;
  onSortChange: (sort: 'latest' | 'popular') => void;
  onClearFilters: () => void;
}

export default function BoardFilter({
  categories,
  selectedCategory,
  sortBy,
  onCategoryChange,
  onSortChange,
  onClearFilters
}: BoardFilterProps) {
  return (
    <div className="p-4 border-b bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category === selectedCategory ? null : category)}
              className={`
                px-3 py-1 rounded-full text-sm
                ${category === selectedCategory
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
        <button
          onClick={onClearFilters}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <FilterX size={16} />
          <span className="text-sm">クリア</span>
        </button>
      </div>
      <div className="flex justify-end">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'latest' | 'popular')}
          className="text-sm border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
        >
          <option value="latest">最新順</option>
          <option value="popular">人気順</option>
        </select>
      </div>
    </div>
  );
}
