// src/components/features/investor/chat/ChatLogItem.tsx
import React, { useState } from 'react';
import { ChatLog, ChatLogItemProps } from '@/types';
import Button from '@/components/ui/Button';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useRouter } from 'next/navigation';

const ChatLogItem: React.FC<ChatLogItemProps> = ({ log, onDelete }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // クリックイベントの伝播を停止
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) onDelete(log.chatId);
    setIsConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  const handleChatClick = () => {
    // 企業ページのチャットタブに遷移し、特定のチャットを選択
    const url = `/investor/company/${log.companyId}?tab=chat&chatId=${log.chatId}`;
    console.log('チャットログクリック - 遷移先:', url);
    router.push(url);
  };

  // 日付表示（例："YYYY/MM/DD HH:mm"）
  const formattedDate = new Date(log.updatedAt).toLocaleString('ja-JP');

  return (
    <div className="bg-white shadow rounded p-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200">
      <div
        className="flex-1 cursor-pointer"
        onClick={handleChatClick}
      >
        <h2 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
          {log.companyName}
        </h2>
        <p className="text-sm text-gray-600 mt-1">{log.lastMessageSnippet}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">{formattedDate}</p>
          {log.totalMessages && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {log.totalMessages}件のメッセージ
            </span>
          )}
        </div>
      </div>
      <div className="flex space-x-2 ml-4">
        {onDelete && (
          <Button 
            label="削除" 
            onClick={handleDeleteClick} 
            variant="destructive"
          />
        )}
      </div>
      <ConfirmDeleteDialog
        isOpen={isConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="チャットログ削除の確認"
        description="このチャットログを削除してもよろしいですか？この操作は取り消せません。"
      />
    </div>
  );
};

export default ChatLogItem;
