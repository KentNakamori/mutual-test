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
  views: number; 
  tags?: string[];
  genreTags?: string[];
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

// Header 用の型定義
export type NavigationLink = {
  label: string;
  href: string;
};

export interface HeaderProps {
  /** ヘッダーに表示するナビゲーションリンク */
  navigationLinks: NavigationLink[];
  /** ユーザーのログイン状態および名前（ログイン時のみ表示） */
  userStatus: {
    isLoggedIn: boolean;
    userName?: string;
  };
  /** ロゴクリック時の遷移処理 */
  onClickLogo: () => void;
}


// QACard 用の型定義
export type QACardMode = 'preview' | 'detail' | 'edit';
export type QACardRole = 'investor' | 'corporate';

export interface QAData {
  id: string;             // QACard では id プロパティを使用
  title: string;
  question: string;
  answer: string;
  createdAt: string;
  views: number;
  likeCount: number;
  tags?: string[];
  genreTags?: string[];
  updatedAt?: string;
}

export interface QACardProps {
  mode: QACardMode;
  role: QACardRole;
  qa: QAData;
  onSelect?: (id: string) => void;
  onLike?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (updatedQa: QAData) => void;
}

// QaDetailModal 用の型定義（必要に応じて）
export interface QaDetailModalProps {
  qa: QAData;
  role: QACardRole;
  onClose: () => void;
  onLike?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSaveEdit?: (updatedQa: QAData) => void;
}

export interface SidebarMenuItem {
  label: string;
  icon?: React.ReactNode;
  link: string;
}

export interface SidebarProps {
  menuItems: SidebarMenuItem[];
  isCollapsible?: boolean;
  selectedItem?: string;
  onSelectMenuItem?: (link: string) => void;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface MinimalFooterProps {
  /** 最小限のフッターリンクリスト（任意） */
  footerLinks?: { label: string; href: string }[];
  /** コピーライトテキスト */
  copyrightText: string;
  /** リンククリック時のコールバック（任意） */
  onSelectLink?: (href: string) => void;
}

export interface MinimalHeaderProps {
  /** ロゴクリック時の処理 */
  onClickLogo: () => void;
  /** 表示するロゴテキスト（任意） */
  logoText?: string;
  /** ロゴ画像のパス（任意） */
  logoSrc?: string;
  /** 最小限のリンクリスト */
  links?: { label: string; href: string }[];
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

export interface GraphDataItem {
  date: string;
  access: number;
  chatCount: number;
}

export interface DashboardQA {
  qaId: string;
  title: string;
  question: string;
  answer: string;
  companyId: string;
  likeCount: number;
  tags: string[];
  genre: string[];
  fiscalPeriod: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface DashboardData {
  stats: {
    daily: { label: string; value: number; unit: string }[];
    weekly: { label: string; value: number; unit: string }[];
    monthly: { label: string; value: number; unit: string }[];
  };
  graphData: {
    daily: GraphDataItem[];
    weekly: GraphDataItem[];
    monthly: GraphDataItem[];
  };
  qas: {
    published: DashboardQA[];
  };
}
//ダッシュボードのフィルター
export type Period = "daily" | "weekly" | "monthly";

export interface Filter {
  period: Period;
}

export interface DashboardQnAListProps {
  publishedQAs: DashboardQA[];
}

export interface Stat {
  label: string;
  value: number;
  unit?: string;
}

export interface DashboardStatsProps {
  statsData: Stat[];
}


export interface FilterBarProps {
  initialFilter: Filter;
  onFilterChange: (newFilter: Filter) => void;
}


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


export interface DashboardGraphsProps {
  graphData: GraphDataItem[];
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

export interface ChatInputAreaProps {
  onSend: (text: string) => void;
}

export interface ChatMessage {
  messageId: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onRegisterQA: () => void;
  onCreateMailDraft: () => void;
}

export interface DraftActionBarProps {
  onRegisterQA: () => void;
  onCreateMailDraft: () => void;
}
export interface Draft {
  draftId: string;
  title: string;
  createdAt: string;
}

export interface DraftItemProps {
  draft: Draft;
  isSelected: boolean;
  onClick: () => void;
}

export interface DraftListProps {
  drafts: Draft[];
  selectedDraftId: string | null;
  onSelectDraft: (draftId: string) => void;
}

export interface MailDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onDraftGenerateなどのAPI連携も必要であれば追加可能
}


export interface MessageBubbleProps {
  message: ChatMessage;
}

export interface MessageListProps {
  messages: ChatMessage[];
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

export interface PasswordResetLinkProps {
  /** パスワード再設定ページへのリンクURL */
  href: string;
}

export interface FileAttachmentSectionProps {
  attachedFiles: FileReference[];
  onAddFile: (file: File) => void;
  onRemoveFile: (fileId: string) => void;
}

export interface GeneratedQaListProps {
  qaDrafts: QA[];
  onUpdateDraft: (index: number, updatedQa: QA) => void;
  onDeleteDraft: (index: number) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export interface QaListCardsProps {
  qaItems: QA[];
  onSelect?: (qaId: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface QaListTableProps {
  qaItems: QA[];
  onEdit: (qaId: string) => void;
  onDelete: (qaId: string) => void;
}

export interface QaTableRowProps {
  qaItem: QA;
  onEdit: (qaId: string) => void;
  onDelete: (qaId: string) => void;
}

export interface SearchFormProps {
  initialQuery?: string;
  onSearch: (params: { query: string; filter?: string; sortOrder?: 'asc' | 'desc' }) => void;
}

export interface TopActionBarProps {
  onSearch: (params: { query: string; theme?: string }) => void;
  onUploadClick: () => void;
}
export interface UploadButtonProps {
  onClick: () => void;
}
export interface UploadFormProps {
  onUploadSuccess: (qas: any[]) => void;
  onUploadError: (error: Error) => void;
  // 新たに資料種類選択用のプロップスを追加
  materialType: string;
  onMaterialTypeChange: (type: string) => void;
}

export interface UploadModalProps {
  onClose: () => void;
  onConfirm: (newQas: QA[]) => void;
}


export interface SettingsTabsProps {
  companyInfo: CompanyInfo;
  refetchCompanyInfo: () => void;
}

export interface CompanyInfoFormProps {
  initialData: CompanyInfo;
  onSaveSuccess: () => void;
}



// 3.3 投資家向けページ コンポーネント Props

export interface ChatLogItemProps {
  log: ChatLog;
  onDelete?: (chatId: string) => void;
  onArchive?: (chatId: string) => void;
}

export interface ChatLogsListProps {
  logs: ChatLog[];
  onDeleteLog: (chatId: string) => void;
  onArchiveLog: (chatId: string) => void;
}

export interface ChatLogsSearchBarProps {
  onSearch: (keyword: string, filter: FilterType) => void;
  initialKeyword?: string;
}

export interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export interface CompanyCardProps {
  company: Company;
  onFollowToggle: (companyId: string, nextState: boolean) => void;
}

export interface CompanyListProps {
  companies: Company[];
  onFollowToggle: (companyId: string, nextState: boolean) => void;
}

export interface CompanySearchQuery {
  keyword: string;
  industry?: string;
}

export interface ChatHistoryProps {
  messages: ChatMessage[];
  loading: boolean;
}

export interface ChatInputBoxProps {
  onSendMessage: (message: string) => void;
}

// チャットメッセージの型定義
export interface ChatMessage {
  messageId: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ChatTabViewProps {
  companyId: string;
}

export interface Company {
  companyId: string;
  companyName: string;
  industry: string;
  logoUrl?: string;
}

export interface CompanyHeaderProps {
  company: Company;
}

export interface FaqItem {
  id: string;
  question: string;
}

export interface FAQPanelProps {
  onSelectFAQ: (faqText: string) => void;
}

export interface QACardProps {
  qa: QAItem;
  onClick: () => void;
}

export interface QADetailModalProps {
  qa: QAItem | null;
  open: boolean;
  onClose: () => void;
  onLike?: (qaId: string) => void; // オプション：いいね処理用ハンドラ
}

export interface QAListProps {
  items: QAItem[];
  onSelectQA: (qa: QAItem) => void;
}

export interface QASearchBarProps {
  onSearch: (keyword: string) => void;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  likeCount: number;
}

export interface TabSwitcherProps {
  activeTab: "chat" | "qa";
  onChangeTab: (tab: "chat" | "qa") => void;
}

export interface AccountDeleteFormProps {
  onDeleteAccount: (password: string) => Promise<void>;
}

export interface MyPageTabMenuProps {
  activeTab: "profile" | "password" | "notification" | "delete";
  onChangeTab: (tab: "profile" | "password" | "notification" | "delete") => void;
  profileData: ProfileData;
  onSaveProfile: (updatedProfile: ProfileData) => Promise<void>;
  onChangePassword: (
    currentPass: string,
    newPass: string
  ) => Promise<void>;
  onSaveNotification: (
    newSetting: NotificationSetting
  ) => Promise<void>;
  onDeleteAccount: (password: string) => Promise<void>;
}

export interface NotificationSettingFormProps {
  initialSetting: NotificationSetting;
  onSaveSetting: (newSetting: NotificationSetting) => Promise<void>;
}

export interface PasswordChangeFormProps {
  onChangePassword: (
    currentPass: string,
    newPass: string
  ) => Promise<void>;
}

export interface ProfileFormProps {
  initialProfile: ProfileData;
  onSaveProfile: (updatedProfile: ProfileData) => Promise<void>;
}

export interface FilterControlsProps {
  /** 現在のフィルター状態 */
  filters: FilterType;
  /** フィルター変更時のコールバック */
  onChangeFilters: (filters: FilterType) => void;
}

export interface QADetailModalProps {
  /** 表示対象のQAデータ。nullの場合は非表示とみなす。 */
  qa: QA;
  /** モーダルを閉じるためのコールバック */
  onClose: () => void;
  /** いいね操作ハンドラ */
  onLike: (qaId: string) => void;
  /** ブックマーク操作ハンドラ */
  onBookmark: (qaId: string) => void;
}

export interface QAResultListProps {
  /** 検索結果のQ&Aリスト */
  items: QA[];
  /** Q&A項目クリック時のハンドラ */
  onItemClick: (qa: QA) => void;
  /** いいね操作ハンドラ */
  onLike: (qaId: string) => void;
  /** ブックマーク操作ハンドラ */
  onBookmark: (qaId: string) => void;
}

export interface QASearchBarProps {
  /** 検索キーワードとフィルター情報を親コンポーネントへ渡すコールバック */
  onSearchSubmit: (keyword: string, filters: FilterType) => void;
}


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
