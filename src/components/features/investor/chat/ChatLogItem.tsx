// src/components/features/investor/chat/ChatLogItem.tsx
import React, { useState } from 'react';
import { ChatLog, ChatLogItemProps } from '@/types';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { getFullImageUrl } from '@/lib/utils/imageUtils';

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

  // 日付表示（例："MM/DD HH:mm"）
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  return (
    <div className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* 左側：企業ロゴ */}
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={handleChatClick}
          >
            {log.logoUrl ? (
              <img
                src={getFullImageUrl(log.logoUrl)}
                alt={`${log.companyName}のロゴ`}
                className="w-12 h-9 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-9 rounded-md bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xs font-medium">
                  {log.companyName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* 中央：企業名と会話内容 */}
          <div 
            className="flex-1 min-w-0 cursor-pointer"
            onClick={handleChatClick}
          >
            <h2 className="text-base font-semibold text-blue-600 hover:text-blue-800 truncate">
              {log.companyName}
            </h2>
            <p className="text-sm text-gray-600 mt-1 truncate">
              {log.lastMessageSnippet}
            </p>
          </div>

          {/* 右側：日時と削除ボタン */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <p className="text-xs text-gray-500 whitespace-nowrap">
              {formatDate(log.updatedAt)}
            </p>
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                aria-label="チャットログを削除"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
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
