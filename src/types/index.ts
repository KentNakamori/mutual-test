// =======================
// 1. 共通ユーティリティ型
// =======================

/** ISO8601形式の文字列 */
export type DateString = string;
/** Epochタイムスタンプ（ミリ秒） */
export type Timestamp = number;

/** エンティティIDのエイリアス */
export type UserId = string;
export type CompanyId = string;
export type QaId = string;
export type ChatId = string;
export type DocumentId = string;
export type DraftId = string;
export type FileId = string;

// =======================
// 2. ドメイン/ビジネスモデル型
// =======================

/**
 * ユーザー情報
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
 * 企業情報  
 * ※ IR API では企業登録時に追加項目（securitiesCode, establishedDate, phone, ceo, businessDescription, capital, employeeCount, websiteUrl, contactEmail）を送信するため、オプショナルとして追加しています。
 */
export interface Company {
  companyId: CompanyId;
  companyName: string;
  industry: string;
  logoUrl?: string;
  createdAt: DateString;
  updatedAt: DateString;
  adminUserIds?: UserId[];
  securitiesCode?: string;        // IR API: 企業証券コード
  establishedDate?: string;       // IR API: 設立年月日
  address?: string;               // 企業登録時に送信される所在地
  phone?: string;                 // 電話番号
  ceo?: string;                   // 代表者名
  businessDescription?: string;   // 事業内容
  capital?: string;               // 資本金
  employeeCount?: number;         // 従業員数
  websiteUrl?: string;            // WebサイトURL
  contactEmail?: string;          // 問い合わせ用メールアドレス
}

/**
 * IR API に準拠する Q&A（企業が作成するQA）  
 * ※ API レスポンスは qaId, title, question, answer, companyId, likeCount, tags, genre, fiscalPeriod, createdAt, updatedAt, isPublished となるため、
 *     UI 用には内部で id として扱い、views は UI 用にオプショナル項目として追加しています。
 */
export interface QA {
  qaId: QaId;
  title: string;
  question: string;
  answer: string;
  companyId: CompanyId;
  likeCount: number;
  tags: string[];
  genre: string[];
  fiscalPeriod: string;
  createdAt: DateString;
  updatedAt: DateString;
  isPublished: boolean;

}

/**
 * チャットメッセージ  
 * ※ IR API の投資家向けチャットは sender を 'user' または 'ai' とするため、プロパティ名を sender に変更しています。
 */
export interface ChatMessage {
  messageId: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: DateString;
}


export interface Document {
  documentId: DocumentId;
  fileName: string;
  fileType: string;
  uploadDate: DateString;
  companyId: CompanyId;
}


export interface Draft {
  draftId: DraftId;
  title: string;
  messages: ChatMessage[];
  status: 'in-progress' | 'completed' | string;
  createdAt: DateString;
  updatedAt: DateString;
}


export interface MailDraft {
  recipientName: string;
  subject?: string;
  body: string;
  createdAt: DateString;
}


export interface FileReference {
  fileId: FileId;
  fileName: string;
  url: string;
  uploadedAt: DateString;
}

/**
 * 企業基本情報（企業設定画面用）  
 * ※ CompanyInfo は、Company とは別にUI向けの編集用データとして扱います。
 */
export interface CompanyInfo {
  companyName: string;
  address: string;
  email: string;
  tel?: string;
  [key: string]: any;
}

export interface ChatLog {
  chatId: ChatId;
  companyName: string;
  lastMessageSnippet: string;
  updatedAt: DateString;
  isArchived: boolean;
}

export type InvestorType = '機関投資家' | '個人投資家' | 'アナリスト' | 'その他';
export type AssetManagementScale = '500万円未満' | '500万～1000万円' | '1000万～3000万' | '3000万円以上';

export interface ProfileData {
  userId: UserId;
  displayName: string;
  email: string;
  investorType?: InvestorType;
  bio?: string;
  investmentExperience?: string;
  assetManagementScale?: AssetManagementScale;
}



export interface NotificationSetting {
  enabled: boolean;
  email?: string;
  frequency?: 'realtime' | 'daily' | 'weekly';
}

// =======================
// 3. API用型
// =======================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: UserId;
  role: 'investor' | 'company' | 'guest' | string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  newAccessToken: string;
  newRefreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface GuestLoginRequest {}

export interface GuestLoginResponse {
  userId: UserId;
  role: 'guest';
  accessToken: string;
  refreshToken?: string;
}

export interface GetUserResponse {
  userId: UserId;
  role: string;
  userName: string;
  email: string;
}

export interface UpdateUserRequest {
  userName?: string;
  email?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  updatedUser: User;
}

/** Q&A 関連 API */
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

/** チャット系 API */
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

/** ファイルアップロード（企業向け） */
export interface UploadRequest {
  file: File;
  meta?: { [key: string]: string | number | boolean };
}
export interface UploadResponse {
  success: boolean;
  generatedQas?: QA[];
  fileIdList?: FileId[];
}

/** メール下書き（企業向け） */
export interface MailDraftRequest {
  recipientName: string;
  subject?: string;
  chatContext?: ChatMessage[];
}
export interface MailDraftResponse {
  generatedText: string;
}

/** 投資家向け Profile / Settings */
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

export interface ErrorResponse {
  errorCode: string;
  message: string;
  status?: number;
}

export interface ApiResult<T> {
  data?: T;
  error?: ErrorResponse;
  status: number;
}

// =======================
// 4. コンポーネント Props 型
// =======================

// 4.1 共通 UI コンポーネント

export type NavigationLink = {
  label: string;
  href: string;
};

export interface HeaderProps {
  navigationLinks: NavigationLink[];
  userStatus: {
    isLoggedIn: boolean;
    userName?: string;
  };
  onClickLogo: () => void;
}

export interface MinimalFooterProps {
  footerLinks?: { label: string; href: string }[];
  copyrightText: string;
  onSelectLink?: (href: string) => void;
}

export interface MinimalHeaderProps {
  onClickLogo: () => void;
  logoText?: string;
  logoSrc?: string;
  links?: { label: string; href: string }[];
}

export interface FooterProps {
  copyright: string;
}

export interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 'primary' | 'destructive' | 'outline' | 'link' | 'gradient';
  type?: "button" | "submit" | "reset";
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
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
  title?: string;
  className?: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChangeTab?: (tabId: string) => void;
}

export interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  errorState?: boolean;
}


// QACard 用のモード・ロール型（企業向けは "corporate"、投資家向けは "investor"）
export type QACardMode = 'preview' | 'detail' | 'edit';
export type QACardRole = 'investor' | 'corporate';

// QACard コンポーネントの Props 型定義
export interface QACardProps {
  mode: QACardMode;
  role: QACardRole;
  qa: QA;
  // プレビュー時の選択用
  onSelect?: (qaId: string) => void;
  // 投資家向け：いいねボタン用
  onLike?: (qaId: string) => void;
  // 企業向け：編集・削除ボタン用
  onEdit?: (qaId: string) => void;
  onDelete?: (qaId: string) => void;
  // 編集状態でのキャンセル/保存コールバック
  onCancelEdit?: () => void;
  onSaveEdit?: (updatedQa: QA) => void;
}

// QaDetailModal コンポーネントの Props 型定義
export interface QADetailModalProps {
  qa: QA;
  isOpen: boolean;
  onClose: () => void;
  role: QACardRole;
  getCompanyName?: (id: string) => string;
  // モーダル内で利用する各アクションのコールバック（必要に応じて実装先で渡してください）
  onLike?: (qaId: string) => void;
  onEdit?: (qaId: string) => void;
  onDelete?: (qaId: string) => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (updatedQa: QA) => void;
}

export interface ConfirmDialogProps {
  /** ダイアログが開いているか */
  isOpen: boolean;
  /** ダイアログのタイトル */
  title: string;
  /** ダイアログの説明テキスト */
  description: string;
  /** 確認ボタンのラベル（任意） */
  confirmLabel?: string;
  /** キャンセルボタンのラベル（任意） */
  cancelLabel?: string;
  /** 確認ボタン押下時のハンドラ */
  onConfirm: () => void;
  /** キャンセルボタン押下時のハンドラ */
  onCancel: () => void;
}

export interface CheckboxProps {
  /** チェック状態 */
  checked: boolean;
  /** チェック変更時のハンドラ */
  onChange: (checked: boolean) => void;
  /** チェックボックスのラベル */
  label: string;
  /** 無効状態 */
  disabled?: boolean;
}

export interface ChatSession {
  sessionId: string;
  title: string;
  lastMessageTimestamp: string;
}

export interface ChatHistoryProps {
  sessions: ChatSession[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

export interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  chatTitle: string;  // 新規追加
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


// 4.2 企業向けページ コンポーネント Props

export interface GraphDataItem {
  date: string;
  likeCount: number;
  chatCount: number;
}

/**
 * ダッシュボードデータ  
 * stats: アクセス数、チャット質問数、公開Q&A数  
 * graphData: 各期間ごとの推移  
 * qas: 公開済み Q&A リスト（IR API では qaId, title, question, answer, companyId, likeCount, tags, genre, fiscalPeriod, createdAt, updatedAt, isPublished）
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

export interface Stat {
  label: string;
  value: number;
  unit?: string;
}

/** IR API では、ダッシュボードフィルターの期間は 'daily' | 'weekly' | 'monthly' として送受信 */
export type Period = "daily" | "weekly" | "monthly";

export interface Filter {
  period: Period;
}

/** ダッシュボード Q&A 一覧用 */
export interface DashboardQnAListProps {
  publishedQAs: QA[];
  onSelectQA: (qaId: string) => void
}

export interface DashboardStatsProps {
  statsData: Stat[];
}

export interface FilterBarProps {
  initialFilter: Filter;
  onFilterChange: (newFilter: Filter) => void;
}

export interface DashboardGraphsProps {
  graphData: GraphDataItem[];
}

/** 企業基本情報編集フォーム用 */
export interface CompanyInfoFormProps {
  initialData: CompanyInfo;
  onSaveSuccess: () => void;
}

/** アカウント設定フォーム */
export interface AccountSettingsFormProps {
  initialProfile: ProfileData;
  onSaveProfile: (updatedProfile: ProfileData) => Promise<void>;
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

// 4.3 投資家向けページ コンポーネント Props

export interface InvestorLoginPageProps {
  // 投資家向けログインページ用プロパティ（必要に応じて追加）
}

export interface GuestLoginButtonProps {
  onGuestLoginSuccess?: () => void;
  onGuestLoginError?: (error: Error) => void;
}

export interface LinkToSignupProps {
  // サインアップリンク用プロパティ
}

export interface TopPageProps {
  companies: Company[];
}

export interface CompanySearchBarProps {
  initialQuery: CompanySearchQuery;
  onSearchChange: (query: CompanySearchQuery) => void;
}

export interface CompanyListProps {
  companies: Company[];
  onFollowToggle: (companyId: string, nextState: boolean) => void;
}

export interface CompanyCardProps {
  company: Company;
  onFollowToggle: (companyId: string, nextState: boolean) => void;
  onCardClick?: (companyId: string) => void;
}

export interface CompanyPageProps {
  company: Company;
}

export interface CompanyHeaderProps {
  company: Company;
}

export interface CompanySearchQuery {
  keyword: string;
  industry?: string;
}

export interface CompanySearchBarProps {
  initialQuery: CompanySearchQuery;
  onSearchChange: (query: CompanySearchQuery & { filter?: string; sortOrder?: 'asc' | 'desc' }) => void;
}

export interface ChatTabViewProps {
  companyId: CompanyId;
  initialChatHistory?: ChatMessage[];
}

export interface QATabViewProps {
  companyId: string;
  companyName: string;
}

export interface QASearchPageProps {
  // Q&A検索ページ用プロパティ
}

export interface QASearchBarProps {
  onSearchSubmit: (keyword: string, filters: FilterType) => void;
}

export interface QAResultListProps {
  qas: QA[];
  onItemClick: (qa: QA) => void;
  onLike: (qaId: string) => void;
  getCompanyName: (companyId: string) => string;
  formatDate: (dateStr: string) => string;
}

export interface QAResultItemProps {
  /** 表示対象のQ&Aデータ */
  qa: QA;
  /** 項目クリック時のハンドラ（QAオブジェクトと qaId を受け取る） */
  onClickItem?: (qa: QA, qaId: string) => void;
  /** いいね操作ハンドラ */
  onLike?: (qaId: string) => void;
}

}


export interface ChatLogsPageProps {
  logs: ChatLog[];
}

export interface ChatLogsSearchBarProps {
  (keyword: string, filter: FilterType) => void;
}

export interface ChatLogsListProps {
  logs: ChatLog[];
  onDeleteLog?: (chatId: string) => void;
  onArchiveLog?: (chatId: string) => void;
}

export interface ChatLogItemProps {
  log: ChatLog;
  onDelete?: (chatId: string) => void;
  onArchive?: (chatId: string) => void;
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
  onSaveProfile: (updatedProfile: ProfileData) => Promise<void>;
}

export interface PasswordResetLinkProps {
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
  onSelect: (qaId: string) => void;
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

// フィルターオプションの型定義
export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'checkbox';
  options?: { value: string; label: string }[];
}

export interface SearchBarProps {
  // 基本プロパティ
  placeholder?: string;
  initialKeyword?: string;
  initialFilters?: Record<string, any>;
  showFilterButton?: boolean;
  
  // カスタマイズ用プロパティ
  className?: string;
  buttonLabel?: string;
  filterButtonLabel?: string;
  
  // フィルター関連
  filterOptions?: FilterOption[];
  filterComponent?: ReactNode; // カスタムフィルターコンポーネント
  
  // コールバック
  onSearch: (keyword: string, filters: Record<string, any>) => void;
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


// =======================
// 5. ユーティリティ型
// =======================

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

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

// FilterControls 用の Props 型定義
export interface FilterControlsProps {
  filters: FilterType;
  onChangeFilters: (newFilters: FilterType) => void;
}

// チームメンバー登録用のリクエスト型
export interface CorporateUserRegistrationData {
  email: string;
  password: string;
  company_id: CompanyId;
  is_admin: boolean;
}

export interface TagOption {
  label: string;   // 表示ラベル
  color: string;   // Tailwind CSSの色クラス (bg-xxx-500など)
}

export interface ChatInputBoxProps {
  /** ユーザーがメッセージを送信したときのコールバック関数 */
  onSendMessage: (message: string) => void;
}

export interface ChatMessagesProps {
  messages: ChatMessage[];
  chatTitle: string;
}

export interface InvestorChatSidebarProps {
  sessions: ChatSession[];
  selectedSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  /** FAQ の質問をチャットに送信するためのコールバック */
  onSendQuestion: (question: string) => void;
}





export type SortOrder = 'asc' | 'desc';
