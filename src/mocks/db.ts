// mocks/db.ts

/**
 * Userエンティティの型定義例
 */
export interface User {
    id: string;
    role: "investor" | "company" | "guest";
    email: string;
    password: string;
    displayName: string;
    // 必要に応じて設定
    notificationSettings?: {
      notifyOnNewQA: boolean;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * Companyエンティティの型定義例
   */
  export interface Company {
    id: string;
    name: string;
    industry: string;
    logoUrl: string;
    description: string;
    followerCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * QAエンティティの型定義例
   */
  export interface QA {
    id: string;
    companyId: string;
    question: string;
    answer: string;
    likeCount: number;
    bookmarkCount: number;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * チャットセッションとメッセージの型定義例
   */
  export interface ChatSession {
    id: string;
    userId: string;
    companyId?: string; // 企業別チャットの場合のみ
    title?: string;
    isArchived?: boolean;
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ChatMessage {
    id: string;
    sessionId: string;
    role: "user" | "ai";
    content: string;
    references?: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * メモリ上に保持するモックDB
   * プロジェクトに応じてエンティティを追加/削除してください
   */
  export const db = {
    users: [] as User[],
    companies: [] as Company[],
    qas: [] as QA[],
    chatSessions: [] as ChatSession[],
    chatMessages: [] as ChatMessage[],
  };
  
  /**
   * 初期データを投入するための関数 (必要に応じて呼び出す)
   */
  export function initializeMockData() {
    // ユーザーのサンプルレコード
    db.users.push(
      {
        id: "user-1",
        role: "investor",
        email: "alice@example.com",
        password: "alicepass", // 実際にはハッシュ化が好ましい
        displayName: "Alice",
        notificationSettings: { notifyOnNewQA: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user-2",
        role: "company",
        email: "bob@company.com",
        password: "bobpass",
        displayName: "Bob Inc.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  
    // 企業のサンプルレコード
    db.companies.push(
      {
        id: "cmp-1001",
        name: "SampleCo",
        industry: "IT",
        logoUrl: "/assets/sampleco-logo.png",
        description: "SampleCoはIT企業です。",
        followerCount: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cmp-1002",
        name: "Foodies",
        industry: "Food",
        logoUrl: "/assets/foodies-logo.png",
        description: "Foodiesは飲食系スタートアップです。",
        followerCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  
    // QAサンプル
    db.qas.push(
      {
        id: "qa-1",
        companyId: "cmp-1001",
        question: "御社の強みは何ですか？",
        answer: "AI技術に強みがあります。",
        likeCount: 2,
        bookmarkCount: 1,
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      // ...必要に応じて追加
    );
  
    // ...ChatSessionやChatMessageも必要があれば追加
  }
  
  