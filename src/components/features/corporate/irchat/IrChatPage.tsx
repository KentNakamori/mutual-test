"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ChatMessages from '@/components/ui/ChatMessages';
import ChatInputBox from '@/components/ui/ChatInputBox';
import CorporateChatSidebar from './CorporateChatSidebar';
import { ChatMessage, ChatSession } from '@/types';
import { getCorporateChatHistory, startNewCorporateChat, sendCorporateChatMessage, getCorporateChatDetail, sendCorporateChatMessageStream } from '@/libs/api';

export default function IrChatPage() {
  const { data: session, status } = useSession();
  // next-auth.d.tsで型拡張をしているので、accessTokenプロパティにアクセスできます
  const token = session?.user?.accessToken || '';
  // 一時的にcompanyNameをcompanyIdとして使用
  const companyId = session?.user?.companyInfo?.companyName || '';
  const userId = session?.user?.id || '';
  
  console.log('認証状態:', status);
  console.log('トークン:', token ? '存在します' : '存在しません');
  console.log('セッション情報:', session);
  console.log('企業ID:', companyId);
  console.log('ユーザーID:', userId);
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // セッション一覧の取得
  useEffect(() => {
    async function fetchChatSessions() {
      if (!token || status !== 'authenticated') return;
      
      try {
        setLoading(true);
        const response = await getCorporateChatHistory(token);
        console.log('チャット履歴APIレスポンス:', response);
        
        // バックエンドのレスポンスをChatSession型に変換
        const convertedSessions: ChatSession[] = response.chatLogs.map(log => ({
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
  }, [token, status]);

  // 選択されたセッションのメッセージ取得
  useEffect(() => {
    async function fetchChatMessages() {
      if (!token || !selectedSessionId || status !== 'authenticated') return;
      
      try {
        setLoading(true);
        const response = await getCorporateChatDetail(token, selectedSessionId);
        console.log('チャット詳細APIレスポンス:', response);
        // バックエンドから返されるメッセージをそのまま使用（role: 'user'|'ai'形式）
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
  }, [selectedSessionId, token, status]);

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  const handleNewChat = async () => {
    console.log('新規チャットボタンがクリックされました');
    console.log('認証状態:', status);
    console.log('トークン:', token ? '存在します' : '存在しません');
    console.log('ユーザーID:', userId);
    
    if (!token || status !== 'authenticated' || !userId) {
      console.log('必要な情報が不足しています');
      return;
    }
    
    try {
      console.log('新規チャット作成を開始します');
      // 新規チャットセッションを作成
      const response = await startNewCorporateChat(token, {
        userId
      });
      console.log('新規チャット作成レスポンス:', response);
      
      // バックエンドから返されたチャットIDを使用
      const newSession: ChatSession = {
        sessionId: response.chatId,
        lastMessageSnippet: '新規チャット',
        lastMessageTimestamp: new Date().toISOString()
      };
      console.log('新しいセッション:', newSession);
      
      // セッション一覧を更新
      setSessions(prev => [newSession, ...prev]);
      setSelectedSessionId(response.chatId);
      setMessages([]);
      console.log('セッション一覧を更新しました');
    } catch (error) {
      console.error('新規チャットの作成中にエラーが発生しました:', error);
    }
  };

  // 固有のメッセージIDを生成する関数
  const generateUniqueId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleSendMessage = async (message: string) => {
    if (!token || !message.trim() || status !== 'authenticated' || !companyId || !userId) return;
    
    // ユーザーメッセージをUIに追加
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
      
      // 既存のチャットか新規チャットかを判断
      if (!selectedSessionId) {
        // 新規チャット
        response = await startNewCorporateChat(token, {
          userId
        });
        
        // セッション一覧を更新
        const newSession: ChatSession = {
          sessionId: response.chatId,
          lastMessageSnippet: message.length > 30 ? message.substring(0, 30) + '...' : message,
          lastMessageTimestamp: new Date().toISOString(),
        };
        
        setSessions(prev => [newSession, ...prev]);
        setSelectedSessionId(response.chatId);
        
        // AIの応答をUIに追加（ストリーミング）
        const aiMessageId = generateUniqueId('ai');
        const aiMessage: ChatMessage = {
          messageId: aiMessageId,
          role: 'ai',
          text: '',
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // ストリーミングレスポンスの処理
        await sendCorporateChatMessageStream(
          token,
          response.chatId,
          message,
          (chunk) => {
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
        // 既存のチャット
        // AIの応答をUIに追加（ストリーミング）
        const aiMessageId = generateUniqueId('ai');
        const aiMessage: ChatMessage = {
          messageId: aiMessageId,
          role: 'ai',
          text: '',
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // ストリーミングレスポンスの処理
        await sendCorporateChatMessageStream(
          token,
          selectedSessionId,
          message,
          (chunk) => {
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
      
      // セッション一覧を更新するために再取得
      const sessionsResponse = await getCorporateChatHistory(token);
      const convertedSessions: ChatSession[] = sessionsResponse.chatLogs.map(log => ({
        sessionId: log.chatId,
        lastMessageSnippet: log.lastMessageSnippet || log.title || '新規チャット',
        lastMessageTimestamp: log.updatedAt
      }));
      setSessions(convertedSessions);
      
    } catch (error) {
      console.error('メッセージ送信中にエラーが発生しました:', error);
      // エラーメッセージを表示
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

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-full">認証情報の読み込み中...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="flex justify-center items-center h-full">ログインしてください</div>;
  }

  if (!isInitialized) {
    return <div className="flex justify-center items-center h-full">チャット情報を読み込み中...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      {/* 左側：チャット用サイドバー */}
      <div className="w-full md:w-64 border-r h-full bg-gray-50">
        <CorporateChatSidebar
          sessions={sessions}
          selectedSessionId={selectedSessionId || ''}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
        />
      </div>
      {/* 右側：チャットエリア */}
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
