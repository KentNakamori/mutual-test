//src/components/features/investor/qa/QASearchBar.tsx
"use client";

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FilterControls from './FilterControls';
import { FilterType, QASearchBarProps} from '@/types';



/**
 * QASearchBar コンポーネント
 * ・キーワード入力、フィルター設定、検索実行ボタンを提供します。
 */
const QASearchBar: React.FC<QASearchBarProps> = ({ onSearchSubmit }) => {
  const [localKeyword, setLocalKeyword] = useState('');
  const [localFilters, setLocalFilters] = useState<FilterType>({});

  const handleSearchClick = () => {
    onSearchSubmit(localKeyword, localFilters);
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <Input 
          value={localKeyword} 
          onChange={setLocalKeyword} 
          placeholder="Q&Aを検索…" 
        />
        <FilterControls filters={localFilters} onChangeFilters={setLocalFilters} />
        <Button label="検索" onClick={handleSearchClick} />
      </div>
    </div>
  );
};

export default QASearchBar;
