// src/components/features/qa/SearchForm.tsx
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export interface SearchFormProps {
  initialQuery?: string;
  onSearch: (params: { query: string; theme?: string }) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ initialQuery = '', onSearch }) => {
  const [query, setQuery] = useState(initialQuery);
  const [theme, setTheme] = useState('all');

  const handleSearchClick = () => {
    onSearch({ query, theme });
  };

  return (
    <div className="flex items-center space-x-2">
      <Input value={query} onChange={setQuery} placeholder="検索キーワード" />
      <Select
        options={[
          { label: '全て', value: 'all' },
          { label: 'テーマ1', value: 'theme1' },
          { label: 'テーマ2', value: 'theme2' },
        ]}
        value={theme}
        onChange={setTheme}
      />
      <Button label="検索" onClick={handleSearchClick} />
    </div>
  );
};

export default SearchForm;
