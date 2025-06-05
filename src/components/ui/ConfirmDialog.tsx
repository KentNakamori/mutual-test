// components/ui/ConfirmDialog.tsx
import React from 'react';
import Dialog from '@/components/ui/Dialog';
import{ ConfirmDialogProps} from '@/types';



/**
 * ConfirmDialog コンポーネント
 * 破壊的操作や重要な確認が必要な場合に、ユーザーに意思確認を促します。
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  showCloseButton = true,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onCancel} title={title} showCloseButton={showCloseButton}>
      <p className="mb-4">{description}</p>
      <div className="flex justify-end space-x-4">
        <button onClick={onCancel} className="bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300">
          {cancelLabel}
        </button>
        <button onClick={onConfirm} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
