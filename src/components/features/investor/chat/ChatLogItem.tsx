//src\components\features\investor\chat\ChatLogItem.tsx
import React, { useState } from 'react';
import { ChatLog } from '@/types';
import Button from '@/components/ui/Button';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

export interface ChatLogItemProps {
  log: ChatLog;
  onDelete?: (chatId: string) => void;
  onArchive?: (chatId: string) => void;
}

/**
 * ChatLogItem コンポーネント
 * ・各チャットログ（企業名、最終更新日時、内容の要約）を表示し、
 * 　削除・アーカイブ操作のためのボタンを提供します。
 */
const ChatLogItem: React.FC<ChatLogItemProps> = ({ log, onDelete, onArchive }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) onDelete(log.chatId);
    setIsConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  const handleArchiveClick = () => {
    if (onArchive) onArchive(log.chatId);
  };

  // 日付表示（例："YYYY/MM/DD HH:mm"）
  const formattedDate = new Date(log.updatedAt).toLocaleString('ja-JP');

  return (
    <div className="bg-white shadow rounded p-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200">
      <div
        className="flex-1 cursor-pointer"
        onClick={() => (window.location.href = `/chat/${log.chatId}`)}
      >
        <h2 className="text-lg font-semibold">{log.companyName}</h2>
        <p className="text-sm text-gray-600">{log.lastMessageSnippet}</p>
        <p className="text-xs text-gray-500">{formattedDate}</p>
        {log.isArchived && <span className="text-xs text-gray-500">(アーカイブ済み)</span>}
      </div>
      <div className="flex space-x-2">
        <Button
          label={log.isArchived ? "アーカイブ解除" : "アーカイブ"}
          onClick={handleArchiveClick}
          variant="outline"
        />
        <Button label="削除" onClick={handleDeleteClick} variant="destructive" />
      </div>
      <ConfirmDeleteDialog
        isOpen={isConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="チャットログ削除の確認"
        description="このチャットログを削除してもよろしいですか？"
      />
    </div>
  );
};

export default ChatLogItem;
