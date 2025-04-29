import { useQuery, useMutation, useQueryClient, UseQueryOptions } from 'react-query';
import { 
  getInvestorChatLogs, 
  createInvestorChat,
  sendInvestorChatMessage,
  getInvestorChatDetail,
  deleteInvestorChat
} from '../libs/api';
import { useAuth } from './useAuth';
import { useState } from 'react';

export interface ChatMessage {
  messageId: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ChatLog {
  chatId: string;
  companyId: string;
  companyName: string;
  title: string;
  lastMessageSnippet: string;
  updatedAt: string;
  totalMessages: number;
}

export interface ChatDetail {
  chatId: string;
  companyId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export const useInvestorChatLogs = (
  options?: {
    companyId?: string;
    page?: number;
    limit?: number;
  },
  queryOptions?: UseQueryOptions
) => {
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const query = {
    companyId: options?.companyId,
    page: options?.page || 1,
    limit: options?.limit || 10
  };

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['investorChatLogs', query],
    () => getInvestorChatLogs(query, token as string),
    {
      enabled: !!token && isAuthenticated,
      ...queryOptions
    }
  );

  return {
    chatLogs: data?.chatLogs || [],
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    error,
    refetch
  };
};

export const useInvestorChatDetail = (chatId: string) => {
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery<ChatDetail>(
    ['investorChatDetail', chatId],
    () => getInvestorChatDetail(chatId, token as string),
    {
      enabled: !!chatId && !!token && isAuthenticated
    }
  );

  return {
    chatDetail: data,
    isLoading,
    error,
    refetch
  };
};

export const useInvestorChat = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // 新規チャット作成
  const createChatMutation = useMutation(
    ({ companyId, message }: { companyId: string; message: string }) => {
      if (!token) return Promise.reject('認証が必要です');
      return createInvestorChat(companyId, message, token);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('investorChatLogs');
      }
    }
  );

  // メッセージ送信（ストリーミング対応）
  const sendMessageMutation = useMutation(
    async ({ chatId, message }: { chatId: string; message: string }) => {
      if (!token) return Promise.reject('認証が必要です');

      setStreamingMessage('');
      setIsStreaming(true);

      try {
        // チャンクを受け取るたびに状態を更新
        await sendInvestorChatMessage(chatId, message, token, (chunk) => {
          setStreamingMessage(prev => prev + ' ' + chunk);
        });

        // 完了後
        setIsStreaming(false);
        return streamingMessage;
      } catch (error) {
        setIsStreaming(false);
        throw error;
      }
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['investorChatDetail', variables.chatId]);
        queryClient.invalidateQueries('investorChatLogs');
      }
    }
  );

  // チャット削除
  const deleteChatMutation = useMutation(
    (chatId: string) => {
      if (!token) return Promise.reject('認証が必要です');
      return deleteInvestorChat(chatId, token);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('investorChatLogs');
      }
    }
  );

  return {
    // 新規チャット作成
    createChat: (companyId: string, message: string) => 
      createChatMutation.mutateAsync({ companyId, message }),
    isCreatingChat: createChatMutation.isLoading,
    createChatError: createChatMutation.error,

    // メッセージ送信
    sendMessage: (chatId: string, message: string) => 
      sendMessageMutation.mutateAsync({ chatId, message }),
    isSendingMessage: sendMessageMutation.isLoading,
    sendMessageError: sendMessageMutation.error,
    
    // ストリーミング状態
    streamingMessage,
    isStreaming,

    // チャット削除
    deleteChat: (chatId: string) => deleteChatMutation.mutateAsync(chatId),
    isDeletingChat: deleteChatMutation.isLoading,
    deleteChatError: deleteChatMutation.error
  };
}; 