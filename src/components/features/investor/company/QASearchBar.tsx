//src\components\features\investor\company\QASearchBar.tsx

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { QASearchBarProps } from '../../../../types';



/**
 * QASearchBar コンポーネント
 * QA一覧をキーワードで検索するための入力欄と検索ボタンを提供します。
 */
const QASearchBar: React.FC<QASearchBarProps> = ({ onSearch }) => {
  const [searchWord, setSearchWord] = useState<string>("");
  
  const handleSearch = () => {
    onSearch(searchWord);
  };
  
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Input value={searchWord} onChange={setSearchWord} placeholder="質問を検索..." />
      <Button label="検索" onClick={handleSearch} />
    </div>
  );
};

export default QASearchBar;
