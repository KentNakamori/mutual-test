// components/ui/ConfirmDialog.tsx
import React from 'react';
import Dialog from '@/components/ui/Dialog';

export interface ConfirmDialogProps {
  /** ダイアログが開いているか */
  isOpen: boolean;
  /** ダイアログのタイトル */
  title: string;
  /** ダイアログの説明テキスト */
  description: string;
  /** 確認ボタンのラベル（任意） */
  confirmLabel?: string;
  /** キャンセルボタンのラベル（任意） */
  cancelLabel?: string;
  /** 確認ボタン押下時のハンドラ */
  onConfirm: () => void;
  /** キャンセルボタン押下時のハンドラ */
  onCancel: () => void;
}

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
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="mb-4">{description}</p>
      <div className="flex justify-end space-x-4">
        <button onClick={onCancel} className="bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300">
          {cancelLabel}
        </button>
        <button onClick={onConfirm} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
