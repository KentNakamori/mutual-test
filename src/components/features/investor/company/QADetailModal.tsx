//src\components\features\investor\company\QADetailModal.tsx

import React from 'react';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import { QAItem } from './QATabView';
import { QADetailModalProps } from '../../../../types';


/**
 * QADetailModal コンポーネント
 * 選択されたQAの詳細（質問全文、回答全文、いいねボタンなど）をモーダルで表示します。
 */
const QADetailModal: React.FC<QADetailModalProps> = ({ qa, open, onClose, onLike }) => {
  if (!qa) return null;
  
  const handleLike = () => {
    if (onLike) {
      onLike(qa.id);
    }
  };
  
  return (
    <Dialog isOpen={open} onClose={onClose} title="質問の詳細">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{qa.question}</h3>
        <p className="text-base text-gray-700">{qa.answer}</p>
      </div>
      <div className="flex justify-end space-x-4">
        <Button label="いいね" onClick={handleLike} variant="primary" />
        <Button label="閉じる" onClick={onClose} variant="outline" />
      </div>
    </Dialog>
  );
};

export default QADetailModal;
