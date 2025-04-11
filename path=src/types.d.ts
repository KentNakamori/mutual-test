// 既存のChatMessagesPropsインターフェースに追加
interface ChatMessagesProps {
  messages: ChatMessage[];
  chatTitle: string;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
} 