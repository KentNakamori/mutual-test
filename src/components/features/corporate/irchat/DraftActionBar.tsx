// src/components/features/corporate/irchat/DraftActionBar.tsx
import React from 'react';
import Button from '../../../ui/Button';
import { DraftActionBarProps } from "@/types"; 


/**
 * DraftActionBar コンポーネント
 * QA登録とメールドラフト作成のアクションボタンを表示します。
 */
const DraftActionBar: React.FC<DraftActionBarProps> = ({ onRegisterQA, onCreateMailDraft }) => {
  return (
    <div className="flex justify-end space-x-2 mt-4">
      <Button label="QA登録" variant="primary" onClick={onRegisterQA} />
      <Button label="メールドラフト作成" variant="gradient" onClick={onCreateMailDraft} />
    </div>
  );
};

export default DraftActionBar;
