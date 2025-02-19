import { factory, primaryKey } from '@mswjs/data';

// MSWのモックデータベース定義
export const db = factory({
  user: {
    id: primaryKey(() => crypto.randomUUID()), // UUIDを生成
    name: String,
    email: String,
    role: () => 'investor', // デフォルトは投資家
    createdAt: () => new Date().toISOString(),
  },
  company: {
    id: primaryKey(() => crypto.randomUUID()),
    name: String,
    industry: String,
    description: String,
    logoUrl: String,
    createdAt: () => new Date().toISOString(),
  },
  qa: {
    id: primaryKey(() => crypto.randomUUID()),
    companyId: String,
    question: String,
    answer: String,
    likeCount: () => 0, // 初期値
    createdAt: () => new Date().toISOString(),
  },
  chatSession: {
    id: primaryKey(() => crypto.randomUUID()),
    userId: String,
    companyId: String,
    title: String,
    createdAt: () => new Date().toISOString(),
  },
  chatMessage: {
    id: primaryKey(() => crypto.randomUUID()),
    sessionId: String,
    sender: () => 'user',
    content: String,
    createdAt: () => new Date().toISOString(),
  },
});
