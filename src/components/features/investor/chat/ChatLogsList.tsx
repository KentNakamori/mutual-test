//src\components\features\investor\chat\ChatLogsList.tsx
import React from 'react';
import { ChatLog, ChatLogsListProps} from '@/types';
import ChatLogItem from './ChatLogItem';

/**
 * ChatLogsList コンポーネント
 * ・取得したチャットログ一覧をリスト形式で表示します。
 */
const ChatLogsList: React.FC<ChatLogsListProps> = ({ logs, onDeleteLog }) => {
  if (logs.length === 0) {
    return <p className="text-gray-600">チャットログが見つかりません。</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {logs.map((log, index) => (
        <ChatLogItem
          key={log.chatId}
          log={log}
          onDelete={onDeleteLog}
        />
      ))}
    </div>
  );
};

export default ChatLogsList;
