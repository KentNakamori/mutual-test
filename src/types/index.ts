// types/index.ts

// =======================
// 共通ユーティリティ型
// =======================

/**
 * ISO8601形式の文字列を表す型
 */
export type DateString = string;

/**
 * Epochタイムスタンプ（ミリ秒）を表す型
 */
export type Timestamp = number;

/**
 * エンティティIDのエイリアス（各ドメイン毎に個別定義）
 */
export type UserId = string;
export type CompanyId = string;
export type QaId = string;
export type ChatId = string;
export type DocumentId = string;
export type DraftId = string;
export type FileId = string;

// =======================
// 1. ドメイン型
// =======================

/**
 * ユーザー情報を表す型
 * 投資家、企業、ゲストなどのユーザーを共通管理
 */
export interface User {
  userId: UserId;
  userName: string;
  email: string;
  role: 'investor' | 'company' | 'guest' | string; // 必要に応じて拡張可能
  createdAt: DateString;
  updatedAt: DateString;
}

/**
 * 企業情報を表す型
 */
export interface Company {
  companyId: CompanyId;
  companyName: string;
  industry: string;
  logoUrl?: string;
  createdAt: DateString;
  updatedAt: DateString;
  adminUserIds?: UserId[]; // 企業担当者のユーザーIDリスト
}

/**
 * Q&A情報を表す型
 */
export interface QA {
  qaId: QaId;
  question: string;
  answer: string;
  companyId: CompanyId;
  likeCount: number;
  createdAt: DateString;
  updatedAt: DateString;
  isPublished: boolean;
}

/**
 * チャットメッセージを表す型
 */
export interface ChatMessage {
  messageId: string;
  role: 'user' | 'ai' | 'system';
  text: string;
  timestamp: DateString;
}

/**
 * ドキュメント（PDF、Wordなど）のメタ情報
 */
export interface Document {
  documentId: DocumentId;
  fileName: string;
  fileType: string; // 例: "pdf", "docx"
  uploadDate: DateString;
  companyId: CompanyId;
}

/**
 * チャット・メッセージの下書きを表す型
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
 * メール下書きの型
 */
export interface MailDraft {
  recipientName: string;
  subject?: string;
  body: string;
  createdAt: DateString;
}

/**
 * Q&Aなどに添付するファイルのメタ情報
 */
export interface FileReference {
  fileId: FileId;
  fileName: string;
  url: string;
  uploadedAt: DateString;
}

/**
 * 企業設定画面などで使用する詳細企業情報
 */
export interface CompanyInfo {
  companyName: string;
  address: string;
  email: string;
  tel?: string;
  // その他、管理用の細かい項目を必要に応じて追加
  [key: string]: any;
}

/**
 * 投資家側のチャット履歴メタ情報
 */
export interface ChatLog {
  chatId: ChatId;
  companyName: string;
  lastMessageSnippet: string;
  updatedAt: DateString;
  isArchived: boolean;
}

/**
 * 投資家ユーザーのプロフィール情報
 */
export interface ProfileData {
  userId: UserId;
  displayName: string;
  email: string;
  investorType?: 'individual' | 'institution' | string;
  bio?: string;
}

/**
 * 投資家向け通知設定の型
 */
export interface NotificationSetting {
  enabled: boolean;
  email?: string;
  frequency?: 'realtime' | 'daily' | 'weekly';
}

// =======================
// 2. API用型
// =======================

// 2.1 Auth系

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: UserId;
  role: 'investor' | 'company' | 'guest' | string;
  accessToken: string;
  refreshToken: string;
  // その他必要に応じたプロパティ
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  newAccessToken: string;
  newRefreshToken: string;
  // その他必要に応じたプロパティ
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface GuestLoginRequest {
  // パラメータ不要の場合は空オブジェクトで定義
}

export interface GuestLoginResponse {
  userId: UserId;
  role: 'guest';
  accessToken: string;
  refreshToken?: string;
}

// 2.2 ユーザー管理系

export interface GetUserResponse {
  userId: UserId;
  role: string;
  userName: string;
  email: string;
  // その他、必要なフィールドを追加
}

export interface UpdateUserRequest {
  userName?: string;
  email?: string;
  // 更新可能なその他のプロパティ
}

export interface UpdateUserResponse {
  success: boolean;
  updatedUser: User;
}

// 2.3 Q&A系

/**
 * Q&A検索などで利用するフィルタ型を継承
 */
export interface GetQAListRequest extends FilterType {
  // 検索条件、ページング、ソート等を含む
}

export interface GetQAListResponse {
  items: QA[];
  totalCount: number;
}

export interface CreateQARequest {
  question: string;
  answer: string;
  companyId: CompanyId;
  // その他必要なプロパティ
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

// 2.4 チャット系

export interface GetChatLogsResponse {
  logs: ChatLog[];
  totalCount: number;
}

export interface ChatRequest {
  message: string;
  context?: ChatMessage[];
  // その他、必要なパラメータを追加
}

export interface ChatResponse {
  reply: string;
  chatId?: ChatId;
  // その他、必要なプロパティを追加
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

// 2.5 ファイルアップロード（企業向け）

export interface UploadRequest {
  file: File; // ブラウザの File オブジェクト
  meta?: { [key: string]: string | number | boolean };
}

export interface UploadResponse {
  success: boolean;
  generatedQas?: QA[];
  fileIdList?: FileId[];
  // その他必要なプロパティ
}

// 2.6 メール下書き系（企業向け）

export interface MailDraftRequest {
  recipientName: string;
  subject?: string;
  chatContext?: ChatMessage[];
}

export interface MailDraftResponse {
  generatedText: string;
  // その他必要なプロパティ
}

// 2.7 Profile / Settings系（投資家向け）

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

// 2.8 エラーレスポンス

export interface ErrorResponse {
  errorCode: string;
  message: string;
  status?: number;
}

/**
 * 汎用APIレスポンスラッパー型
 */
export interface ApiResult<T> {
  data?: T;
  error?: ErrorResponse;
  status: number;
}

// =======================
// 3. コンポーネント Props 型
// =======================

// 3.1 共通UIコンポーネント

export interface LayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  // ユーザーメニューやログイン状態などのナビゲーション関連プロパティ
}

export interface SidebarProps {
  menuItems: { label: string; link: string }[];
}

export interface FooterProps {
  copyright: string;
}

export interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'destructive' | string;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  errorState?: boolean;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// 3.2 企業向けページ コンポーネント Props

export interface LoginCardProps {
  // 企業ログイン画面用のカード（内部状態完結の場合はほぼ不要）
}

export interface LoginFormProps {
  onLoginSuccess?: (user: User) => void;
  onLoginError?: (error: Error) => void;
}

export interface PasswordResetLinkProps {
  onReset?: () => void;
}

export interface DashboardStatsProps {
  statsData: { label: string; value: number; unit?: string }[];
}

export interface FilterBarProps {
  initialFilter: FilterType;
  onFilterChange: (newFilter: FilterType) => void;
}

export interface QaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: QA) => void;
}

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: UploadResponse) => void;
}

export interface IrChatPageProps {
  // 必要なプロパティを定義
}

export interface DraftListProps {
  drafts: Draft[];
  onSelectDraft: (draftId: DraftId) => void;
}

export interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface CompanyInfoFormProps {
  initialData: CompanyInfo;
  onSave: (data: CompanyInfo) => void;
}

export interface AccountSettingsFormProps {
  initialProfile: ProfileData;
  onSaveProfile: (updated: ProfileData) => Promise<void>;
}

// 3.3 投資家向けページ コンポーネント Props

export interface InvestorLoginPageProps {
  // 投資家向けログインページの必要なプロパティ
}

export interface GuestLoginButtonProps {
  onGuestLoginSuccess?: () => void;
  onGuestLoginError?: (error: Error) => void;
}

export interface LinkToSignupProps {
  // サインアップへのリンクに必要なプロパティ
}

export interface TopPageProps {
  companies: Company[];
}

export interface CompanySearchBarProps {
  onSearchSubmit: (keyword: string, filters: FilterType) => void;
}

export interface CompanyListProps {
  companies: Company[];
}

export interface CompanyCardProps {
  company: Company;
  onFollowToggle?: (id: CompanyId, nextState: boolean) => void;
}

export interface CompanyPageProps {
  company: Company;
}

export interface ChatTabViewProps {
  companyId: CompanyId;
  initialChatHistory?: ChatMessage[];
}

export interface QATabViewProps {
  companyId: CompanyId;
}

export interface QASearchPageProps {
  // Q&A検索ページに必要なプロパティ
}

export interface QASearchBarProps {
  onSearchSubmit: (keyword: string, filters: FilterType) => void;
}

export interface QAResultListProps {
  qas: QA[];
}

export interface QADetailModalProps {
  qa: QA;
  isOpen: boolean;
  onClose: () => void;
}

export interface ChatLogsPageProps {
  logs: ChatLog[];
}

export interface ChatLogsSearchBarProps {
  onSearch: (keyword: string) => void;
}

export interface ChatLogsListProps {
  logs: ChatLog[];
  onDeleteLog?: (chatId: ChatId) => void;
  onArchiveLog?: (chatId: ChatId) => void;
}

export interface ChatLogItemProps {
  log: ChatLog;
  onDelete?: (chatId: ChatId) => void;
  onArchive?: (chatId: ChatId) => void;
}

export interface MyPageProps {
  profile: ProfileData;
}

export interface MyPageTabMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface ProfileFormProps {
  initialProfile: ProfileData;
  onSaveProfile: (updated: ProfileData) => Promise<void>;
}

export interface PasswordChangeFormProps {
  onChangePassword: (data: ChangePasswordRequest) => Promise<void>;
}

export interface NotificationSettingFormProps {
  initialSetting: NotificationSetting;
  onSaveSetting: (setting: NotificationSetting) => Promise<void>;
}

export interface AccountDeleteFormProps {
  onDeleteAccount: (data: DeleteAccountRequest) => Promise<void>;
}

// =======================
// 4. ユーティリティ型
// =======================

/**
 * 一覧系APIで利用するページング情報
 */
export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

/**
 * ソート・フィルタ情報
 */
export interface FilterType {
  likeMin?: number;
  dateRange?: {
    from?: DateString;
    to?: DateString;
  };
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  [key: string]: any;
}

/**
 * ソート順の型定義
 */
export type SortOrder = 'asc' | 'desc';
