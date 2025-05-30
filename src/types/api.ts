import { 
  UserId, 
  CompanyId, 
  QaId, 
  ChatId, 
  FilterType,
  DateString
} from './common';
import { 
  User, 
  QA, 
  ChatMessage, 
  ChatLog, 
  ProfileData, 
  NotificationSetting 
} from './models';

/**
 * ログインリクエスト（認証用）
 * - ユーザーログイン
 * - 認証情報検証
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * ログインレスポンス（認証用）
 * - 認証トークン発行
 * - ユーザー情報返却
 */
export interface LoginResponse {
  token: string;
  refreshToken: string;
  userId: string;
  message: string;
}

/**
 * トークンリフレッシュリクエスト（認証用）
 * - アクセストークン更新
 */
export interface RefreshRequest {
  refreshToken: string;
}

/**
 * トークンリフレッシュレスポンス（認証用）
 * - 新しいトークン発行
 */
export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * ログアウトリクエスト（認証用）
 * - セッション終了
 * - トークン無効化
 */
export interface LogoutRequest {
  userId: string;
}

/**
 * ログアウトレスポンス（認証用）
 * - ログアウト結果通知
 */
export interface LogoutResponse {
  message: string;
}

/**
 * ユーザー情報取得レスポンス（ユーザー管理用）
 * - ユーザー情報表示
 */
export interface GetUserResponse {
  userId: UserId;
  role: string;
  userName: string;
  email: string;
}

/**
 * ユーザー情報更新リクエスト（ユーザー管理用）
 * - ユーザー情報編集
 */
export interface UpdateUserRequest {
  userName?: string;
  email?: string;
}

/**
 * ユーザー情報更新レスポンス（ユーザー管理用）
 * - 更新結果通知
 */
export interface UpdateUserResponse {
  success: boolean;
  updatedUser: User;
}

/**
 * Q&A関連API（Q&A管理用）
 * - Q&A一覧取得
 * - Q&A作成
 * - Q&Aいいね
 * - Q&Aブックマーク
 */
export interface GetQAListRequest extends FilterType {}
export interface GetQAListResponse {
  items: QA[];
  totalCount: number;
}
export interface CreateQARequest {
  question: string;
  answer: string;
  companyId: CompanyId;
}
export interface CreateQAResponse {
  success: boolean;
  newQa: QA;
}
export interface LikeQARequest {
  qaId: QaId;
}
export interface LikeQAResponse {
  success: boolean;
  likeCount: number;
}
export interface BookmarkQARequest {
  qaId: QaId;
}
export interface BookmarkQAResponse {
  success: boolean;
  bookmarked: boolean;
}

/**
 * チャット関連API（チャット機能用）
 * - チャットログ取得
 * - チャット送信
 * - チャットログ削除
 * - チャットログアーカイブ
 */
export interface GetChatLogsResponse {
  logs: ChatLog[];
  totalCount: number;
}
export interface ChatRequest {
  message: string;
  context?: ChatMessage[];
}
export interface ChatResponse {
  reply: string;
  chatId?: ChatId;
}
export interface DeleteChatLogRequest {
  chatId: ChatId;
}
export interface DeleteChatLogResponse {
  success: boolean;
}
export interface ArchiveChatLogRequest {
  chatId: ChatId;
}
export interface ArchiveChatLogResponse {
  success: boolean;
}

/**
 * ファイルアップロード関連API（ファイル管理用）
 * - ファイルアップロード
 * - Q&A自動生成
 */
export interface UploadRequest {
  file: File;
  meta?: { [key: string]: string | number | boolean };
}
export interface UploadResponse {
  success: boolean;
  generatedQas?: QA[];
  fileIdList?: string[];
}

/**
 * メール下書き関連API（メール機能用）
 * - メール下書き作成
 * - メール本文生成
 */
export interface MailDraftRequest {
  recipientName: string;
  subject?: string;
  chatContext?: ChatMessage[];
}
export interface MailDraftResponse {
  generatedText: string;
}

/**
 * 投資家向けプロフィール/設定関連API（ユーザー管理用）
 * - プロフィール更新
 * - パスワード変更
 * - 通知設定更新
 * - アカウント削除
 */
export interface UpdateProfileRequest extends ProfileData {}
export interface UpdateProfileResponse {
  success: boolean;
  updatedProfile: ProfileData;
}
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}
export interface UpdateNotificationSettingRequest extends NotificationSetting {}
export interface UpdateNotificationSettingResponse {
  success: boolean;
  updatedSetting: NotificationSetting;
}
export interface DeleteAccountRequest {
  password: string;
}
export interface DeleteAccountResponse {
  success: boolean;
  message?: string;
}

/**
 * エラーレスポンス（エラー処理用）
 * - エラー情報通知
 */
export interface ErrorResponse {
  errorCode: string;
  message: string;
  status?: number;
}

/**
 * 企業ユーザー登録データ（ユーザー登録用）
 * - ユーザー登録情報
 */
export interface CorporateUserRegistrationData {
  email: string;
  password: string;
  company_id: CompanyId;
  is_admin: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
  investorType: string;
  investmentExperience: string;
  companyName?: string;
  assetManagementScale?: string;
}

/**
 * 企業向けIRチャット関連API（チャット機能用）
 * - チャット履歴取得
 * - チャット詳細取得
 * - 新規チャット作成
 * - メッセージ送信
 */
export interface ChatHistoryItem {
  chatId: string;
  userId: string;
  title: string;
  lastMessageSnippet: string;
  updatedAt: string;
  totalMessages: number;
}

export interface ChatHistoryResponse {
  chatLogs: ChatHistoryItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface ChatDetailResponse {
  chatId: string;
  userId: string;
  messages: ChatMessage[];
}

export interface IRChatResponse {
  chatId: string;
}

export interface IRChatMessageResponse {
  chatId: string;
  reply: string;
  userMessageId: string;
  aiMessageId: string;
} 