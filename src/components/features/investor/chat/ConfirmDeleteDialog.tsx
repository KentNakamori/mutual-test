//src\components\features\investor\chat\ConfirmDeleteDialog.tsx
import React from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ConfirmDialogProps } from '@/types';


/**
 * ConfirmDeleteDialog コンポーネント
 * ・削除操作前に「本当に削除しますか？」と確認するためのダイアログです。
 * 　共通コンポーネント ConfirmDialog を再利用しています。
 */
const ConfirmDeleteDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "削除確認",
  description = "本当に削除しますか？この操作は元に戻せません。",
  confirmLabel = "削除",
  cancelLabel = "キャンセル",
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      showCloseButton={false}
    />
  );
};

export default ConfirmDeleteDialog;
