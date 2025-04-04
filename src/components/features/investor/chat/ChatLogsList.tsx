//src\components\features\investor\chat\ChatLogsList.tsx
import React from 'react';
import { ChatLog, ChatLogsListProps} from '@/types';
import ChatLogItem from './ChatLogItem';



/**
 * ChatLogsList コンポーネント
 * ・取得したチャットログ一覧をカード形式で表示します。
 */
const ChatLogsList: React.FC<ChatLogsListProps> = ({ logs, onDeleteLog, onArchiveLog }) => {
  if (logs.length === 0) {
    return <p className="text-gray-600">チャットログが見つかりません。</p>;
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <ChatLogItem
          key={log.chatId}
          log={log}
          onDelete={onDeleteLog}
          onArchive={onArchiveLog}
        />
      ))}
    </div>
  );
};

export default ChatLogsList;
