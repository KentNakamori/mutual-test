// src/components/features/investor/company/InvestorChatTabview.tsx 
"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from "@auth0/nextjs-auth0";
import { useSearchParams } from 'next/navigation';
import InvestorChatSidebar from './InvestorChatSidebar';
import ChatMessages from '@/components/ui/ChatMessages';
import ChatInputBox from '@/components/ui/ChatInputBox';
import { ChatMessage, ChatTabViewProps, ChatSession } from '@/types';
import { useGuest } from '@/contexts/GuestContext';
import GuestRestrictedContent from '@/components/features/investor/common/GuestRestrictedContent';
import { 
  getInvestorChatLogs, 
  createInvestorChat, 
  getInvestorChatDetail, 
  sendInvestorChatMessage 
} from '@/lib/api';

const ChatTabView: React.FC<ChatTabViewProps> = ({ companyId }) => {
  const { isGuest } = useGuest();
  const searchParams = useSearchParams();
  const targetChatId = searchParams.get('chatId'); // URLからchatIdを取得
  
  // Auth0 SDK v4 の認証状態
  const { user, error: userError, isLoading: userLoading } = useUser();

  // ✅ ゲストまたは認証エラーの場合は制限表示
  if (isGuest || (userError && !userLoading)) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <GuestRestrictedContent featureName="チャット" />
      </div>
    );
  }

  // ✅ 認証情報のロード中
  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">ログイン情報を確認中...</p>
      </div>
    );
  }

  // ✅ 未ログイン時
  if (!user && !isGuest) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg mb-4">このコンテンツを利用するにはログインが必要です</p>
        <a 
          href="/api/auth/login"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          ログイン
        </a>
      </div>
    );
  }

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // チャットセッション一覧の取得
  useEffect(() => {
    async function fetchChatSessions() {
      if (!user || userLoading) return;
      
      try {
        setLoading(true);
        console.log('投資家チャットログ取得開始:', { companyId });
        
        // 特定企業のチャットログを取得
        const response = await getInvestorChatLogs(
          { companyId, page: 1, limit: 50 },
          '' // プロキシ経由でJWTを送信するため空文字列
        );
        
        console.log('投資家チャットログAPIレスポンス:', response);
        
        // APIレスポンスをChatSession型に変換
        const convertedSessions: ChatSession[] = response.chatLogs.map((log: any) => ({
          sessionId: log.chatId,
          lastMessageSnippet: log.lastMessageSnippet || log.title || '新規チャット',
          lastMessageTimestamp: log.updatedAt
        }));
        
        setChatSessions(convertedSessions);
        
        // URLにchatIdが指定されている場合はそのチャットを選択
        if (targetChatId && convertedSessions.some(session => session.sessionId === targetChatId)) {
          console.log('URLで指定されたチャットを選択:', targetChatId);
          setSelectedSessionId(targetChatId);
        } else if (convertedSessions.length > 0 && !selectedSessionId) {
          // 最初のセッションを選択（targetChatIdが指定されていない、または見つからない場合）
          setSelectedSessionId(convertedSessions[0].sessionId);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('投資家チャットログの取得中にエラーが発生しました:', error);
        // エラーが発生してもUIは表示する
        setIsInitialized(true);
      } finally {
        setLoading(false);
      }
    }

    fetchChatSessions();
  }, [companyId, user, userLoading, targetChatId]);

  // 選択されたセッションのメッセージ取得
  useEffect(() => {
    async function fetchChatMessages() {
      if (!user || !selectedSessionId || userLoading) return;
      
      // 一時的なセッションの場合はメッセージ取得をスキップ
      if (selectedSessionId.startsWith('temp-')) {
        console.log('一時的なセッションのため、メッセージ取得をスキップ:', selectedSessionId);
        setMessages([]);
        return;
      }
      
      try {
        setLoading(true);
        console.log('投資家チャット詳細取得開始:', { selectedSessionId });
        
        const response = await getInvestorChatDetail(
          selectedSessionId,
          '' // プロキシ経由でJWTを送信するため空文字列
        );
        
        console.log('投資家チャット詳細APIレスポンス:', response);
        setMessages(response.messages);
      } catch (error) {
        console.error('投資家チャットメッセージの取得中にエラーが発生しました:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    if (selectedSessionId) {
      fetchChatMessages();
    }
  }, [selectedSessionId, user, userLoading]);

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  const handleNewChat = async () => {
    if (!user || userLoading) {
      console.log('新規チャット作成: 必要な情報が不足しています');
      return;
    }
    
    try {
      console.log('投資家新規チャット作成開始:', { companyId });
      
      // ローカルで一時的な新規セッションを作成（APIは呼び出さない）
      const tempSessionId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const newSession: ChatSession = {
        sessionId: tempSessionId,
        lastMessageSnippet: '新規チャット',
        lastMessageTimestamp: new Date().toISOString()
    };
      
    setChatSessions(prev => [newSession, ...prev]);
      setSelectedSessionId(tempSessionId);
      setMessages([]);
      
      console.log('投資家新規チャット作成完了（ローカル）:', { tempSessionId });
    } catch (error) {
      console.error('投資家新規チャットの作成中にエラーが発生しました:', error);
    }
  };

  const generateUniqueId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleSendMessage = async (message: string) => {
    if (!user || !message.trim() || userLoading) {
      console.error('投資家メッセージ送信: 必要な情報が不足しています:', {
        user: !!user,
        message: message.trim(),
        userLoading
      });
      return;
    }
    
    console.log('投資家メッセージ送信開始:', { message, selectedSessionId, companyId });
    
    const newUserMessage: ChatMessage = {
      messageId: generateUniqueId('user'),
      role: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      let currentChatId = selectedSessionId;
      
      // セッションが選択されていない、または一時的なセッションの場合は新規作成
      if (!currentChatId || currentChatId.startsWith('temp-')) {
        console.log('投資家新規チャットセッション作成:', { companyId, message });
        console.log('createInvestorChat呼び出しパラメータ:', {
          companyId: companyId,
          companyIdType: typeof companyId,
          message: message,
          messageType: typeof message,
          messageLength: message.length
        });
        
        const newChatResponse = await createInvestorChat(
          companyId,
          message, // 実際のメッセージで新規チャットを作成
          '' // プロキシ経由でJWTを送信するため空文字列
        );
        
        console.log('投資家新規チャットセッション作成完了:', newChatResponse);
        currentChatId = newChatResponse.chatId;
        
        const newSession: ChatSession = {
          sessionId: currentChatId,
          lastMessageSnippet: message.length > 30 ? message.substring(0, 30) + '...' : message,
          lastMessageTimestamp: new Date().toISOString(),
        };
        
        // 一時的なセッションを削除して新しいセッションに置き換え
        setChatSessions(prev => {
          const filteredSessions = prev.filter(session => !session.sessionId.startsWith('temp-'));
          return [newSession, ...filteredSessions];
        });
        setSelectedSessionId(currentChatId);
        
        // 初期レスポンスがある場合は表示
        if (newChatResponse.reply) {
          const aiMessage: ChatMessage = {
          messageId: generateUniqueId('ai'),
            role: 'ai',
            text: newChatResponse.reply,
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      } else {
        // 既存セッションにメッセージ送信
        console.log('投資家既存セッションへのメッセージ送信:', { currentChatId, message });
        
        const aiMessageId = generateUniqueId('ai');
        const aiMessage: ChatMessage = {
          messageId: aiMessageId,
          role: 'ai',
          text: '',
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // ストリーミングでメッセージ送信
        await sendInvestorChatMessage(
          currentChatId,
          message,
          (chunk: string) => {
            console.log('投資家AIレスポンスチャンク受信:', chunk);
            setMessages(prev => prev.map(msg => {
              if (msg.messageId === aiMessageId) {
                return {
                  ...msg,
                  text: msg.text + chunk,
                };
              }
              return msg;
            }));
          },
          '' // プロキシ経由でJWTを送信するため空文字列
        );
      }
      
      // チャット履歴を更新
      console.log('投資家チャット履歴更新開始');
      const sessionsResponse = await getInvestorChatLogs(
        { companyId, page: 1, limit: 50 },
        '' // プロキシ経由でJWTを送信するため空文字列
      );
      
      const convertedSessions: ChatSession[] = sessionsResponse.chatLogs.map((log: any) => ({
        sessionId: log.chatId,
        lastMessageSnippet: log.lastMessageSnippet || log.title || '新規チャット',
        lastMessageTimestamp: log.updatedAt
      }));
      setChatSessions(convertedSessions);
      
    } catch (error) {
      console.error('投資家メッセージ送信中にエラーが発生しました:', error);
      const errorMessage: ChatMessage = {
        messageId: generateUniqueId('error'),
        role: 'ai',
        text: 'メッセージの送信中にエラーが発生しました。もう一度お試しください。',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // FAQからの質問送信用ハンドラー
  const handleSendQuestion = (question: string) => {
    handleSendMessage(question);
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">チャット情報を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* 左側サイドバー：固定幅 */}
      <div className="w-full md:w-64 border-r h-full bg-gray-50">
        <InvestorChatSidebar
          sessions={chatSessions}
          selectedSessionId={selectedSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onSendQuestion={handleSendQuestion}
        />
      </div>

      {/* 右側チャットエリア */}
      <div className="flex-1 h-full flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages} />
        </div>
        <div className="bg-white">
          <ChatInputBox onSendMessage={handleSendMessage} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default ChatTabView;
