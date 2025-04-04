// components/ui/QaDetailModal.tsx
import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import QACard, { QACardMode } from '@/components/ui/QACard';
import { QADetailModalProps, QA, } from '@/types';

const QaDetailModal: React.FC<QADetailModalProps> = ({
  qa,
  isOpen,
  onClose,
  role,
  onLike,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
}) => {
  const [mode, setMode] = useState<QACardMode>('detail');

  // 企業向けの場合、編集ボタンで編集モードへ切替え
  const handleEdit = (qaId: string) => {
    if (role === 'corporate') {
      setMode('edit');
      onEdit && onEdit(qaId);
    }
  };

  // 編集保存後、詳細表示に戻す
  const handleSaveEdit = (updatedQa: QA) => {
    onSaveEdit && onSaveEdit(updatedQa);
    setMode('detail');
  };

  // 編集キャンセル時、詳細表示に戻す
  const handleCancelEdit = () => {
    onCancelEdit && onCancelEdit();
    setMode('detail');
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="QA詳細">
      <QACard
        mode={mode}
        role={role}
        qa={qa}
        onLike={onLike}
        onEdit={handleEdit}
        onDelete={onDelete}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
      />
    </Dialog>
  );
};

export default QaDetailModal;
