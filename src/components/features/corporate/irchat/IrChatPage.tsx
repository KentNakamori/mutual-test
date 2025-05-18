"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0'
import ChatMessages from '@/components/ui/ChatMessages';
import ChatInputBox from '@/components/ui/ChatInputBox';
import CorporateChatSidebar from './CorporateChatSidebar';
import { ChatMessage, ChatSession } from '@/types';
import { getCorporateChatHistory, startNewCorporateChat, getCorporateChatDetail, sendCorporateChatMessageStream } from '@/lib/api';

export default function IrChatPage() {
  const { user, error, isLoading } = useUser();
  const userId = user?.sub || '';
  
  console.log('認証状態:', isLoading ? '読み込み中' : error ? 'エラー' : '認証済み');
  console.log('ユーザー情報:', user);
  console.log('ユーザーID:', userId);
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // セッション一覧の取得
  useEffect(() => {
    async function fetchChatSessions() {
      if (!user || isLoading) return;
      
      try {
        setLoading(true);
        const response = await getCorporateChatHistory();
        console.log('チャット履歴APIレスポンス:', response);
        
        // バックエンドのレスポンスをChatSession型に変換
        const convertedSessions: ChatSession[] = response.chatLogs.map((log: any) => ({
          sessionId: log.chatId,
          lastMessageSnippet: log.lastMessageSnippet || log.title || '新規チャット',
          lastMessageTimestamp: log.updatedAt
        }));
        
        setSessions(convertedSessions);
        
        // 最初のセッションを選択
        if (convertedSessions.length > 0 && !selectedSessionId) {
          setSelectedSessionId(convertedSessions[0].sessionId);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('チャット履歴の取得中にエラーが発生しました:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchChatSessions();
  }, [user, isLoading]);

  // 選択されたセッションのメッセージ取得
  useEffect(() => {
    async function fetchChatMessages() {
      if (!user || !selectedSessionId || isLoading) return;
      
      try {
        setLoading(true);
        const response = await getCorporateChatDetail(selectedSessionId);
        console.log('チャット詳細APIレスポンス:', response);
        setMessages(response.messages);
      } catch (error) {
        console.error('チャットメッセージの取得中にエラーが発生しました:', error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedSessionId) {
      fetchChatMessages();
    }
  }, [selectedSessionId, user, isLoading]);

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  const handleNewChat = async () => {
    if (!user || isLoading || !userId) {
      console.log('必要な情報が不足しています');
      return;
    }
    
    try {
      console.log('新規チャット作成を開始します');
      const response = await startNewCorporateChat();
      console.log('新規チャット作成レスポンス:', response);
      
      const newSession: ChatSession = {
        sessionId: response.chatId,
        lastMessageSnippet: '新規チャット',
        lastMessageTimestamp: new Date().toISOString()
      };
      
      setSessions(prev => [newSession, ...prev]);
      setSelectedSessionId(response.chatId);
      setMessages([]);
    } catch (error) {
      console.error('新規チャットの作成中にエラーが発生しました:', error);
    }
  };

  const generateUniqueId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleSendMessage = async (message: string) => {
    if (!user || !message.trim() || isLoading) {
      console.error('メッセージ送信に必要な情報が不足しています:', {
        user: !!user,
        message: message.trim(),
        isLoading
      });
      return;
    }
    
    console.log('メッセージ送信開始:', { message, selectedSessionId });
    
    const newUserMessage: ChatMessage = {
      messageId: generateUniqueId('user'),
      role: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      let response;
      
      if (!selectedSessionId) {
        console.log('新規チャットセッションを作成します');
        response = await startNewCorporateChat();
        console.log('新規チャットセッション作成完了:', response);
        
        const newSession: ChatSession = {
          sessionId: response.chatId,
          lastMessageSnippet: message.length > 30 ? message.substring(0, 30) + '...' : message,
          lastMessageTimestamp: new Date().toISOString(),
        };
        
        setSessions(prev => [newSession, ...prev]);
        setSelectedSessionId(response.chatId);
        
        const aiMessageId = generateUniqueId('ai');
        const aiMessage: ChatMessage = {
          messageId: aiMessageId,
          role: 'ai',
          text: '',
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        console.log('新規セッションへのメッセージ送信開始');
        await sendCorporateChatMessageStream(
          response.chatId,
          message,
          (chunk: string) => {
            console.log('AIレスポンスチャンク受信:', chunk);
            setMessages(prev => prev.map(msg => {
              if (msg.messageId === aiMessageId) {
                return {
                  ...msg,
                  text: msg.text + chunk + ' ',
                };
              }
              return msg;
            }));
          }
        );
      } else {
        console.log('既存セッションへのメッセージ送信開始:', selectedSessionId);
        const aiMessageId = generateUniqueId('ai');
        const aiMessage: ChatMessage = {
          messageId: aiMessageId,
          role: 'ai',
          text: '',
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        await sendCorporateChatMessageStream(
          selectedSessionId,
          message,
          (chunk: string) => {
            console.log('AIレスポンスチャンク受信:', chunk);
            setMessages(prev => prev.map(msg => {
              if (msg.messageId === aiMessageId) {
                return {
                  ...msg,
                  text: msg.text + chunk + ' ',
                };
              }
              return msg;
            }));
          }
        );
      }
      
      console.log('チャット履歴を更新します');
      const sessionsResponse = await getCorporateChatHistory();
      console.log('チャット履歴更新完了:', sessionsResponse);
      
      const convertedSessions: ChatSession[] = sessionsResponse.chatLogs.map((log: any) => ({
        sessionId: log.chatId,
        lastMessageSnippet: log.lastMessageSnippet || log.title || '新規チャット',
        lastMessageTimestamp: log.updatedAt
      }));
      setSessions(convertedSessions);
      
    } catch (error) {
      console.error('メッセージ送信中にエラーが発生しました:', error);
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">認証情報の読み込み中...</div>;
  }

  if (error || !user) {
    return <div className="flex justify-center items-center h-full">ログインしてください</div>;
  }

  if (!isInitialized) {
    return <div className="flex justify-center items-center h-full">チャット情報を読み込み中...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      <div className="w-full md:w-64 border-r h-full bg-gray-50">
        <CorporateChatSidebar
          sessions={sessions}
          selectedSessionId={selectedSessionId || ''}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
        />
      </div>
      <div className="flex-1 h-full flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages messages={messages} />
        </div>
        <div className="p-4 bg-white">
          <ChatInputBox onSendMessage={handleSendMessage} loading={loading} />
        </div>
      </div>
    </div>
  );
}
