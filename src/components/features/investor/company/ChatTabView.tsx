// src/components/features/investor/company/InvestorChatTabview.tsx 
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from "@auth0/nextjs-auth0";
import { useSearchParams } from 'next/navigation';
import InvestorChatSidebar from './InvestorChatSidebar';
import ChatMessages from '@/components/ui/ChatMessages';
import ChatInputBox from '@/components/ui/ChatInputBox';
import { ChatMessage, ChatTabViewProps, ChatSession } from '@/types';
import GuestRestrictedContent from '@/components/features/investor/common/GuestRestrictedContent';
import { 
  getInvestorChatLogs, 
  startNewInvestorChat,
  getInvestorChatDetail, 
  sendInvestorChatMessage 
} from '@/lib/api';

const ChatTabView: React.FC<ChatTabViewProps> = ({ companyId }) => {
  const searchParams = useSearchParams();
  const targetChatId = searchParams.get('chatId');
  
  const { user, error: userError, isLoading: userLoading } = useUser();

  // ゲスト判定: ユーザーがいない、ローディングが終了、エラーがない
  const isGuest = !user && !userLoading && !userError;

  // ゲストまたは認証エラーの場合は制限表示
  if (isGuest || (userError && !userLoading)) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <GuestRestrictedContent featureName="チャット" />
      </div>
    );
  }

  // 認証情報のロード中
  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">ログイン情報を確認中...</p>
      </div>
    );
  }

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  
  // メッセージIDの重複を防ぐためのカウンター
  const messageCounterRef = useRef<number>(0);

  // チャットセッション一覧の取得
  useEffect(() => {
    async function fetchChatSessions() {
      if (!user || userLoading) return;
      
      try {
        setLoading(true);
        console.log('投資家チャットログ取得開始:', { companyId });
        
        const response = await getInvestorChatLogs(
          { companyId, page: 1, limit: 50 },
          ''
        );
        
        console.log('投資家チャットログAPIレスポンス:', response);
        
        const convertedSessions: ChatSession[] = response.chatLogs
          .filter((log: any) => log.chatId) // chatIdが存在するもののみ
          .map((log: any) => ({
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
          setSelectedSessionId(convertedSessions[0].sessionId);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('投資家チャットログの取得中にエラーが発生しました:', error);
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
      
      try {
        setLoading(true);
        console.log('投資家チャット詳細取得開始:', { selectedSessionId });
        
        const response = await getInvestorChatDetail(selectedSessionId, '');
        
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
      console.log('新規チャット作成を開始します');
      const response = await startNewInvestorChat(companyId);
      console.log('新規チャット作成レスポンス:', response);
      
      const newSession: ChatSession = {
        sessionId: response.chatId,
        lastMessageSnippet: '新規チャット',
        lastMessageTimestamp: new Date().toISOString()
      };
      
      setChatSessions(prev => [newSession, ...prev]);
      setSelectedSessionId(response.chatId);
      setMessages([]);
    } catch (error) {
      console.error('新規チャットの作成中にエラーが発生しました:', error);
    }
  };

  const generateUniqueId = (prefix: string) => {
    messageCounterRef.current += 1;
    return `${prefix}-${Date.now()}-${messageCounterRef.current}-${Math.random().toString(36).substring(2, 9)}`;
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
    
    // ユニークなIDを生成（重複チェック付き）
    let userMessageId = generateUniqueId('user');
    while (messages.some(msg => msg.messageId === userMessageId)) {
      userMessageId = generateUniqueId('user');
    }
    
    const newUserMessage: ChatMessage = {
      messageId: userMessageId,
      role: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    // AIメッセージのプレースホルダーを作成（重複チェック付き）
    let aiMessageId = generateUniqueId('ai');
    while (messages.some(msg => msg.messageId === aiMessageId) || aiMessageId === userMessageId) {
      aiMessageId = generateUniqueId('ai');
    }
    
    const aiMessage: ChatMessage = {
      messageId: aiMessageId,
      role: 'ai',
      text: '',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMessage]);

    try {
      let currentSessionId = selectedSessionId;
      
      // セッションが選択されていない場合はエラー
      if (!currentSessionId) {
        console.error('チャットセッションが選択されていません。新規チャットを作成してください。');
        setMessages(prev => {
          const newMessages = [...prev];
          const targetIndex = newMessages.findIndex(msg => msg.messageId === aiMessageId);
          
          if (targetIndex !== -1) {
            newMessages[targetIndex] = {
              ...newMessages[targetIndex],
              text: 'チャットセッションが選択されていません。新規チャットを作成してください。',
              timestamp: new Date().toISOString(),
            };
          }
          
          return newMessages;
        });
        setLoading(false);
        return;
      }
      
      console.log('メッセージ送信開始:', currentSessionId);
      // ストリーミング処理（新規・既存両方で実行）
      await sendInvestorChatMessage(
        currentSessionId,
        message,
        // onChunk: 文字単位でメッセージを更新
        (chunk: string) => {
          console.log('📨 チャンク受信:', chunk);
          setMessages(prev => {
            // 新しい配列を作成して確実に再レンダリングをトリガー
            const newMessages = [...prev];
            const targetIndex = newMessages.findIndex(msg => msg.messageId === aiMessageId);
            
            if (targetIndex !== -1) {
              // 既存のメッセージオブジェクトを新しいオブジェクトで置き換え
              newMessages[targetIndex] = {
                ...newMessages[targetIndex],
                text: newMessages[targetIndex].text + chunk,
                timestamp: new Date().toISOString(), // タイムスタンプも更新
              };
            }
            
            return newMessages;
          });
        },
        '', // プロキシ経由でJWTを送信するため空文字列
        // onStart: ストリーミング開始時の処理
        () => {
          console.log('🚀 投資家ストリーミング開始');
          // ストリーミング開始時に空のメッセージを確認
          setMessages(prev => {
            const newMessages = [...prev];
            const targetIndex = newMessages.findIndex(msg => msg.messageId === aiMessageId);
            
            if (targetIndex !== -1 && newMessages[targetIndex].text === '') {
              console.log('✅ AIメッセージの準備完了');
            }
            
            return newMessages;
          });
        },
        // onEnd: ストリーミング完了時の処理
        (fullResponse: string) => {
          console.log('🏁 投資家ストリーミング完了:', fullResponse.length, '文字');
          // 最終的なメッセージを確定（念のため）
          setMessages(prev => {
            const newMessages = [...prev];
            const targetIndex = newMessages.findIndex(msg => msg.messageId === aiMessageId);
            
            if (targetIndex !== -1) {
              newMessages[targetIndex] = {
                ...newMessages[targetIndex],
                text: fullResponse,
                timestamp: new Date().toISOString(),
              };
            }
            
            return newMessages;
          });
        },
        // onError: エラー時の処理
        (error: string) => {
          console.error('❌ 投資家ストリーミングエラー:', error);
          setMessages(prev => {
            const newMessages = [...prev];
            const targetIndex = newMessages.findIndex(msg => msg.messageId === aiMessageId);
            
            if (targetIndex !== -1) {
              newMessages[targetIndex] = {
                ...newMessages[targetIndex],
                text: `エラーが発生しました: ${error}`,
                timestamp: new Date().toISOString(),
              };
            }
            
            return newMessages;
          });
        }
      );
      
      // チャット履歴を更新
      console.log('投資家チャット履歴を更新します');
      const sessionsResponse = await getInvestorChatLogs(
        { companyId, page: 1, limit: 50 },
        ''
      );
      console.log('投資家チャット履歴更新完了:', sessionsResponse);
      
      const convertedSessions: ChatSession[] = sessionsResponse.chatLogs
        .filter((log: any) => log.chatId) // chatIdが存在するもののみ
        .map((log: any) => ({
          sessionId: log.chatId,
          lastMessageSnippet: log.lastMessageSnippet || log.title || '新規チャット',
          lastMessageTimestamp: log.updatedAt
        }));
      setChatSessions(convertedSessions);
      
    } catch (error) {
      console.error('投資家メッセージ送信中にエラーが発生しました:', error);
      // エラーメッセージがすでに表示されていない場合のみ追加
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.messageId === aiMessageId && !lastMessage.text.startsWith('エラーが発生しました')) {
          return prev.map(msg => {
            if (msg.messageId === aiMessageId) {
              return {
                ...msg,
                text: 'メッセージの送信中にエラーが発生しました。もう一度お試しください。',
              };
            }
            return msg;
          });
        }
        return prev;
      });
    } finally {
      setLoading(false);
    }
  };

  // FAQ質問選択ハンドラー
  const handleQuestionSelect = (question: string) => {
    setInputValue(question);
  };

  if (userLoading) {
    return <div className="flex justify-center items-center h-full">認証情報の読み込み中...</div>;
  }

  if (userError || !user) {
    return <div className="flex justify-center items-center h-full">ログインしてください</div>;
  }

  if (!isInitialized) {
    return <div className="flex justify-center items-center h-full">チャット情報を読み込み中...</div>;
  }

  return (
    <div className="flex h-full min-h-0">
      <div className="w-full md:w-64 border-r h-full bg-gray-50 overflow-hidden min-h-0">
        <InvestorChatSidebar
          sessions={chatSessions}
          selectedSessionId={selectedSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onQuestionSelect={handleQuestionSelect}
        />
      </div>
      <div className="flex-1 h-full flex flex-col bg-white min-h-0">
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          <ChatMessages messages={messages} />
        </div>
        <div className="p-4 bg-white">
          <ChatInputBox 
            onSendMessage={handleSendMessage} 
            loading={loading}
            inputValue={inputValue}
            onInputChange={setInputValue}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatTabView;
