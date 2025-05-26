import { ChatMessage, ChatLog, ChatSession } from '../models';
import { ChatId, CompanyId, FilterType } from '../common';

/**
 * チャット履歴（チャット履歴表示用）
 * - チャット履歴表示
 * - チャットセッション選択
 */
export interface ChatHistoryProps {
  sessions: ChatSession[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

/**
 * チャットエリア（チャット表示用）
 * - メッセージ表示
 * - メッセージ送信
 */
export interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  chatTitle: string;
}

/**
 * チャットタブビュー（チャット表示用）
 * - チャット表示
 * - チャット履歴表示
 */
export interface ChatTabViewProps {
  companyId: CompanyId;
  initialChatHistory?: ChatMessage[];
}

/**
 * チャットログページ（チャット履歴表示用）
 * - チャット履歴表示
 */
export interface ChatLogsPageProps {
  logs: ChatLog[];
}

/**
 * チャットログ検索バー（チャット履歴検索用）
 * - 検索表示
 * - 検索処理
 */
export interface ChatLogsSearchBarProps {
  onSearch: (keyword: string, filter: FilterType) => void | Promise<void>;
  initialKeyword?: string;
  loading?: boolean;
}

/**
 * チャットログリスト（チャット履歴一覧表示用）
 * - チャット履歴一覧表示
 * - チャットログ操作
 */
export interface ChatLogsListProps {
  logs: ChatLog[];
  onDeleteLog?: (chatId: string) => void;
}

/**
 * チャットログ項目（チャットログ表示用）
 * - チャットログ表示
 * - チャットログ操作
 */
export interface ChatLogItemProps {
  log: ChatLog;
  onDelete?: (chatId: string) => void;
}

/**
 * チャットメッセージ（チャット用）
 * - メッセージ表示
 */
export interface ChatMessagesProps {
  messages: ChatMessage[];
} 