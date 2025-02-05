import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface MeetingActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const MeetingActions: React.FC<MeetingActionsProps> = ({
  onEdit,
  onDelete,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded border border-gray-300 hover:border-gray-400"
        >
          編集
        </button>
        <button
          onClick={handleDeleteClick}
          className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 rounded"
        >
          削除
        </button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>面談記録を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。関連するQ&Aがある場合、削除できない場合があります。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded border border-gray-300 hover:border-gray-400">
                キャンセル
              </button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 rounded"
              >
                削除する
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeetingActions;
