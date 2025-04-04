//src\components\features\investor\chat\ConfirmDeleteDialog.tsx
import React from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ConfirmDeleteDialogProps} from '@/types';


/**
 * ConfirmDeleteDialog コンポーネント
 * ・削除操作前に「本当に削除しますか？」と確認するためのダイアログです。
 * 　共通コンポーネント ConfirmDialog を再利用しています。
 */
const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "削除確認",
  description = "本当に削除しますか？この操作は元に戻せません。",
}) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title={title}
      description={description}
    />
  );
};

export default ConfirmDeleteDialog;
