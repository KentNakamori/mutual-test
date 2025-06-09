import { 
  UserId, 
  CompanyId, 
  QaId, 
  ChatId, 
  DocumentId, 
  DraftId, 
  FileId, 
  DateString
} from './common';
import { Industry } from './industry';

/**
 * ユーザー情報（アプリケーションの認証・認可に使用）
 * - ユーザー管理
 * - 権限管理
 * - プロフィール表示
 */
export interface User {
  userId: UserId;
  userName: string;
  email: string;
  role: 'investor' | 'company' | 'guest' | string;
  createdAt: DateString;
  updatedAt: DateString;
}

/**
 * 企業情報（企業プロフィール・IR情報管理用）
 * - 企業プロフィール表示
 * - IR情報管理
 * - 企業検索
 */
export interface Company {
  companyId: CompanyId;
  companyName: string;
  industry: Industry;
  logoUrl?: string;
  securitiesCode?: string;        // IR API: 企業証券コード
  majorStockExchange?: string;    // 主要取引所
  websiteUrl?: string;            // WebサイトURL
  createdAt?: DateString;
  updatedAt?: DateString;
  adminUserIds?: UserId[];
  establishedDate?: string;       // IR API: 設立年月日
  address?: string;               // 企業登録時に送信される所在地
  phone?: string;                 // 電話番号
  ceo?: string;                   // 代表者名
  businessDescription?: string;   // 事業内容
  capital?: string;               // 資本金
  employeeCount?: number;         // 従業員数
  contactEmail?: string;          // 問い合わせ用メールアドレス
}

/**
 * Q&A情報（投資家向けQ&A管理用）
 * - Q&A一覧表示
 * - Q&A詳細表示
 * - Q&A投稿・編集
 */
export interface QA {
  qaId: QaId;
  title: string;
  question: string;
  answer: string;
  companyId: CompanyId;
  companyName?: string;
  reviewStatus: 'DRAFT' | 'PENDING' | 'PUBLISHED';
  likeCount: number;
  question_route?: string;
  source: string[];
  genre: string[];
  fiscalPeriod?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: DateString;
  updatedAt: DateString;
  isLiked?: boolean;
}

/**
 * チャットメッセージ（投資家向けチャット機能用）
 * - チャット履歴表示
 * - メッセージ送受信
 * - チャットセッション管理
 */
export interface ChatMessage {
  messageId: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: DateString;
}

/**
 * ドキュメント情報（企業向けドキュメント管理用）
 * - ドキュメント一覧表示
 * - ドキュメントアップロード
 * - ドキュメントダウンロード
 */
export interface Document {
  documentId: DocumentId;
  fileName: string;
  fileType: string;
  uploadDate: DateString;
  companyId: CompanyId;
}

/**
 * 下書き情報（Q&Aやメールの下書き管理用）
 * - 下書き保存
 * - 下書き編集
 * - 下書き一覧表示
 */
export interface Draft {
  draftId: DraftId;
  title: string;
  messages: ChatMessage[];
  status: 'in-progress' | 'completed' | string;
  createdAt: DateString;
  updatedAt: DateString;
}

/**
 * メール下書き（企業向けメール送信機能用）
 * - メール下書き作成
 * - メール下書き編集
 * - メール送信
 */
export interface MailDraft {
  recipientName: string;
  subject?: string;
  body: string;
  createdAt: DateString;
}

/**
 * ファイル参照情報（ファイル管理用）
 * - ファイルアップロード
 * - ファイルダウンロード
 * - ファイル一覧表示
 */
export interface FileReference {
  fileId: FileId;
  fileName: string;
  url: string;
  uploadedAt: DateString;
}

/**
 * 企業基本情報（企業設定画面用）
 * - 企業情報編集
 * - 企業プロフィール管理
 */
export interface CompanyInfo {
  companyName: string;
  industry?: Industry;
  address: string;
  email: string;
  tel?: string;
  securitiesCode?: string;
  establishedDate?: string;
  ceo?: string;
  businessDescription?: string;
  capital?: string;
  employeeCount?: number;
  websiteUrl?: string;
  contactEmail?: string;
  [key: string]: string | number | Industry | undefined;
}

/**
 * チャットログ（チャット履歴管理用）
 * - チャット履歴一覧表示
 * - チャット履歴検索
 */
export interface ChatLog {
  chatId: ChatId;
  companyId: CompanyId;
  companyName: string;
  logoUrl?: string;
  lastMessageSnippet: string;
  updatedAt: DateString;
  totalMessages?: number;
}

/**
 * チャットセッション（チャット管理用）
 * - チャットセッション情報
 */
export interface ChatSession {
  sessionId: string;
  lastMessageTimestamp: string;
  lastMessageSnippet: string;
}

/**
 * 投資家タイプ（投資家プロフィール用）
 * - 投資家分類
 * - 投資家向け機能制御
 */
export type InvestorType = '機関投資家' | '個人投資家' | 'アナリスト' | 'その他' | string;

/**
 * 資産管理規模（投資家プロフィール用）
 * - 投資家分類
 * - 投資家向け機能制御
 */
export type AssetManagementScale = '500万円未満' | '500万～1000万円' | '1000万～3000万' | '3000万円以上' | string;

/**
 * プロフィールデータ（ユーザープロフィール管理用）
 * - プロフィール表示
 * - プロフィール編集
 * - ユーザー情報管理
 */
export interface ProfileData {
  userId: UserId;
  displayName: string;
  email: string;
  investorType?: InvestorType;
  bio?: string;
  investmentExperience?: string;
  assetManagementScale?: AssetManagementScale;
}

/**
 * 通知設定（通知管理用）
 * - 通知設定の有効/無効
 * - 通知先メールアドレス
 * - 通知頻度
 */
export interface NotificationSetting {
  enabled: boolean;
  email?: string;
  frequency?: 'realtime' | 'daily' | 'weekly';
}

/**
 * グラフデータ項目（ダッシュボード用）
 * - グラフ表示データ
 */
export interface GraphDataItem {
  date: string | Date;
  access: number;
  chatCount: number;
}

/**
 * ダッシュボードデータ（ダッシュボード用）
 * - 統計情報
 * - グラフデータ
 * - Q&A一覧
 */
export interface DashboardData {
  stats: {
    daily: Stat[];
    weekly: Stat[];
    monthly: Stat[];
  };
  graphData: {
    daily: GraphDataItem[];
    weekly: GraphDataItem[];
    monthly: GraphDataItem[];
  };
  qas: {
    published: QA[];
  };
}

/**
 * 統計情報（ダッシュボード用）
 * - 統計データ表示
 */
export interface Stat {
  label: string;
  value: number;
  unit?: string;
}

/**
 * 期間（ダッシュボード用）
 * - 期間選択
 */
export type Period = "daily" | "weekly" | "monthly";

/**
 * ファイルコレクション（ファイル管理用）
 * - アップロードされたファイルの管理
 * - ファイル一覧表示
 * - ファイル削除
 */
export interface FileCollection {
  id: string;
  companyId: CompanyId;
  fileName: string;
  fileSize: number;
  fileType: string;
  documentType: string;
  fiscalPeriod: string;  // バックエンドの実際のフィールド名に修正
  uploadDate: DateString;
  isProcessed?: boolean;
  processMessage?: string;  // 処理状況のメッセージ
  s3Key?: string | null;
  s3Url?: string | null;
  s3UrlGeneratedAt?: DateString;  // S3 URL生成日時
  chunksCount?: number;
}

/**
 * ファイルチャンク（ファイル内容管理用）
 * - PDFのページごとの情報管理
 * - 文字起こし結果の保存
 */
export interface FileChunk {
  id: string;
  fileId: string;
  pageNumber: number;
  chunkSummary: string;
  chunkDetailDescription: string;
}

/**
 * ファイル管理APIレスポンス
 */
export interface FileManagementResponse {
  files: FileCollection[];
  totalCount: number;
  totalPages: number;
} 