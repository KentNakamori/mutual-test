// src/components/features/investor/chat/ChatLogItem.tsx
import React, { useState } from 'react';
import { ChatLog, ChatLogItemProps } from '@/types';
import Button from '@/components/ui/Button';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

const ChatLogItem: React.FC<ChatLogItemProps> = ({ log, onDelete }) => {
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

  // 日付表示（例："YYYY/MM/DD HH:mm"）
  const formattedDate = new Date(log.updatedAt).toLocaleString('ja-JP');

  return (
    <div className="bg-white shadow rounded p-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200">
      <div
        className="flex-1 cursor-pointer"
        onClick={() => (window.location.href = `/investor/company/${log.companyId}?tab=chat`)}
      >
        <h2 className="text-lg font-semibold">{log.companyName}</h2>
        <p className="text-sm text-gray-600">{log.lastMessageSnippet}</p>
        <p className="text-xs text-gray-500">{formattedDate}</p>
      </div>
      <div className="flex space-x-2">
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
