// src/components/ui/QaDetailModal.tsx
import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import QACard, { QAData, QACardMode, QACardRole } from '@/components/ui/QACard';

export interface QaDetailModalProps {
  qa: QAData;
  role: QACardRole; // 追加：企業向け or 投資家向けを指定
  onClose: () => void;
  onLike?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSaveEdit?: (updatedQa: QAData) => void;
}

const QaDetailModal: React.FC<QaDetailModalProps> = ({ qa, role, onClose, onLike, onDelete, onSaveEdit }) => {
  const [mode, setMode] = useState<QACardMode>("detail");

  const handleEditClick = (id: string) => {
    // 企業向けの場合のみ編集可能にする
    if (role === 'corporate') {
      setMode("edit");
    }
  };

  const handleCancelEdit = () => {
    setMode("detail");
  };

  const handleSaveEdit = (updatedQa: QAData) => {
    if (onSaveEdit) {
      onSaveEdit(updatedQa);
    }
    setMode("detail");
  };

  return (
    <Dialog isOpen={true} onClose={onClose} title="QA詳細">
      <QACard
        mode={mode}
        role={role} // role をそのまま渡す
        qa={qa}
        onLike={onLike}
        onEdit={handleEditClick}
        onDelete={onDelete}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
      />
    </Dialog>
  );
};

export default QaDetailModal;
