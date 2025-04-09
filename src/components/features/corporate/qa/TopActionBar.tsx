// src/components/features/corporate/qa/TopActionBar.tsx
import React from 'react';
import SearchForm from '@/components/ui/SearchForm';
import UploadButton from './UploadButton';
import { TopActionBarProps} from '@/types';


const TopActionBar: React.FC<TopActionBarProps> = ({ onSearch, onUploadClick }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <SearchForm onSearch={onSearch} />
      <UploadButton onClick={onUploadClick} />
    </div>
  );
};

export default TopActionBar;
