/**
 * ConfirmDialogコンポーネント
 * - 「本当に削除してよいですか？」などの確認ダイアログを簡単に実装
 * - shadcnのAlertDialogを利用
 */

import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/shadcn/alert-dialog";

type ConfirmDialogProps = {
  /** ダイアログが開いているかどうか */
  isOpen: boolean;
  /** タイトル (例: "Are you sure?") */
  title?: string;
  /** メッセージ (例: "This action cannot be undone!") */
  message?: string;
  /** OKボタンの文言 (例: "Yes, Delete") */
  confirmLabel?: string;
  /** キャンセルボタンの文言 (例: "Cancel") */
  cancelLabel?: string;
  /** OK押下時のハンドラ */
  onConfirm: () => void;
  /** キャンセル時のハンドラ(ダイアログを閉じる) */
  onCancel: () => void;
};

/**
 * ConfirmDialog
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = "Confirm",
  message = "Are you sure?",
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      {/* Triggerは外から制御する想定 */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
