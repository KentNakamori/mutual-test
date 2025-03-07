//src\components\features\investor\chat\ChatLogsSearchBar.tsx
import React, { useState, FormEvent } from 'react';
import { FilterType } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export interface ChatLogsSearchBarProps {
  onSearch: (keyword: string, filter: FilterType) => void;
  initialKeyword?: string;
}

/**
 * ChatLogsSearchBar コンポーネント
 * ・チャットログの検索キーワード入力と（将来的な）フィルター設定を提供します。
 */
const ChatLogsSearchBar: React.FC<ChatLogsSearchBarProps> = ({ onSearch, initialKeyword = '' }) => {
  const [localKeyword, setLocalKeyword] = useState<string>(initialKeyword);
  // 今回は検索キーワードのみを扱います。必要に応じて他のフィルター情報も追加可能です。
  const [localFilter, setLocalFilter] = useState<FilterType>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(localKeyword, localFilter);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-6">
      <Input
        value={localKeyword}
        onChange={setLocalKeyword}
        placeholder="検索ワードを入力してください..."
        type="text"
      />
      <Button label="検索" type="submit" />
    </form>
  );
};

export default ChatLogsSearchBar;
