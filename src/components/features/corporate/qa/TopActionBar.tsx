// src/components/features/corporate/qa/TopActionBar.tsx
import React from 'react';
import SearchForm from './SearchForm';
import UploadButton from './UploadButton';

export interface TopActionBarProps {
  onSearch: (params: { query: string; theme?: string }) => void;
  onUploadClick: () => void;
}

const TopActionBar: React.FC<TopActionBarProps> = ({ onSearch, onUploadClick }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <SearchForm onSearch={onSearch} />
      <UploadButton onClick={onUploadClick} />
    </div>
  );
};

export default TopActionBar;
