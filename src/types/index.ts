import { ReactNode } from 'react';

// =======================
// 1. 共通ユーティリティ型
// =======================

/** ISO8601形式の文字列（日付データの保存・表示用） */
export type DateString = string;
/** Epochタイムスタンプ（ミリ秒）（時間計算・比較用） */
export type Timestamp = number;

/** エンティティIDのエイリアス（型の一貫性と可読性向上のため） */
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
  industry: string;
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
  tag?: string;
  source: string[];
  genre: string[];
  fiscalPeriod?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: DateString;
  updatedAt: DateString;
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
  address: string;
  email: string;
  tel?: string;
  [key: string]: any;
}

/**
 * チャットログ（チャット履歴管理用）
 * - チャット履歴一覧表示
 * - チャット履歴検索
 * - チャット履歴アーカイブ
 */
export interface ChatLog {
  chatId: ChatId;
  companyName: string;
  lastMessageSnippet: string;
  updatedAt: DateString;
  isArchived: boolean;
}

/**
 * 投資家タイプ（投資家プロフィール用）
 * - 投資家分類
 * - 投資家向け機能制御
 */
export type InvestorType = '機関投資家' | '個人投資家' | 'アナリスト' | 'その他';

/**
 * 資産管理規模（投資家プロフィール用）
 * - 投資家分類
 * - 投資家向け機能制御
 */
export type AssetManagementScale = '500万円未満' | '500万～1000万円' | '1000万～3000万' | '3000万円以上';

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
 * 通知設定（ユーザー通知管理用）
 * - 通知設定管理
 * - 通知配信制御
 */
export interface NotificationSetting {
  enabled: boolean;
  email?: string;
  frequency?: 'realtime' | 'daily' | 'weekly';
}

// =======================
// 3. API用型
// =======================

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
  userId: UserId;
  role: 'investor' | 'company' | 'guest' | string;
  accessToken: string;
  refreshToken: string;
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
  newAccessToken: string;
  newRefreshToken: string;
}

/**
 * ログアウトリクエスト（認証用）
 * - セッション終了
 * - トークン無効化
 */
export interface LogoutRequest {
  refreshToken: string;
}

/**
 * ログアウトレスポンス（認証用）
 * - ログアウト結果通知
 */
export interface LogoutResponse {
  success: boolean;
  message?: string;
}

/**
 * ゲストログインリクエスト（認証用）
 * - ゲストユーザー作成
 */
export interface GuestLoginRequest {}

/**
 * ゲストログインレスポンス（認証用）
 * - ゲストユーザー情報返却
 */
export interface GuestLoginResponse {
  userId: UserId;
  role: 'guest';
  accessToken: string;
  refreshToken?: string;
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
  fileIdList?: FileId[];
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
 * API結果（APIレスポンス用）
 * - 成功/エラー結果の統一的な表現
 */
export interface ApiResult<T> {
  data?: T;
  error?: ErrorResponse;
  status: number;
}

// =======================
// 4. コンポーネント Props 型
// =======================

// 4.1 共通 UI コンポーネント

/**
 * ナビゲーションリンク（ナビゲーション用）
 * - メニュー項目定義
 */
export type NavigationLink = {
  label: string;
  href: string;
};

/**
 * タブスイッチャー（タブ切り替え用）
 * - Q&A/チャットタブ切り替え
 */
export interface TabSwitcherProps {
  activeTab: "qa" | "chat";
  onChangeTab: (tab: "qa" | "chat") => void;
}

/**
 * ヘッダー（共通ヘッダー用）
 * - ナビゲーション表示
 * - ユーザー状態表示
 */
export interface HeaderProps {
  navigationLinks: NavigationLink[];
  userStatus: {
    isLoggedIn: boolean;
    userName?: string;
  };
  onClickLogo: () => void;
}

/**
 * フッター（共通フッター用）
 * - フッターリンク表示
 * - 著作権表示
 */
export interface MinimalFooterProps {
  footerLinks?: { label: string; href: string }[];
  copyrightText: string;
  onSelectLink?: (href: string) => void;
}

/**
 * 最小限ヘッダー（シンプルなヘッダー用）
 * - ロゴ表示
 * - 最小限のナビゲーション
 */
export interface MinimalHeaderProps {
  onClickLogo: () => void;
  logoText?: string;
  logoSrc?: string;
  links?: { label: string; href: string }[];
}

/**
 * フッター（共通フッター用）
 * - 著作権表示
 */
export interface FooterProps {
  copyright: string;
}

/**
 * ボタン（共通ボタン用）
 * - ボタン表示
 * - クリックイベント処理
 */
export interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 'primary' | 'destructive' | 'outline' | 'link' | 'gradient';
  type?: "button" | "submit" | "reset";
}

/**
 * カード（共通カード用）
 * - コンテンツ表示
 * - クリックイベント処理
 */
export interface CardProps {
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * 入力フィールド（共通入力用）
 * - テキスト入力
 * - 入力値変更処理
 */
export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  errorState?: boolean;
}

/**
 * ダイアログ（モーダル用）
 * - モーダル表示
 * - モーダル制御
 */
export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  showCloseButton?: boolean;
}

/**
 * オプション（セレクトボックス用）
 * - 選択肢定義
 */
export interface Option {
  label: string;
  value: string;
}

/**
 * セレクトボックス（選択用）
 * - 選択肢表示
 * - 選択値変更処理
 */
export interface SelectProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * カラム（テーブル用）
 * - テーブル列定義
 */
export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

/**
 * タブ（タブ表示用）
 * - タブ定義
 */
export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

/**
 * タブスイッチャー（タブ切り替え用）
 * - タブ表示
 * - タブ切り替え処理
 */
export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChangeTab?: (tabId: string) => void;
}

/**
 * テキストエリア（複数行入力用）
 * - 複数行テキスト入力
 * - 入力値変更処理
 */
export interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  errorState?: boolean;
}

/**
 * Q&Aカード（Q&A表示用）
 * - Q&A表示
 * - Q&A操作
 */
export type QACardMode = 'preview' | 'detail' | 'edit';
export type QACardRole = 'investor' | 'corporate';

export interface QACardProps {
  mode: QACardMode;
  role: QACardRole;
  qa: QA;
  onSelect?: (qaId: string) => void;
  onLike?: (qaId: string) => void;
  onEdit?: (qaId: string) => void;
  onDelete?: (qaId: string) => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (updatedQa: QA) => void;
}

/**
 * Q&A詳細モーダル（Q&A詳細表示用）
 * - Q&A詳細表示
 * - Q&A操作
 */
export interface QADetailModalProps {
  qa: QA;
  isOpen: boolean;
  onClose: () => void;
  role: QACardRole;
  onLike?: (qaId: string) => void;
  onEdit?: (qaId: string) => void;
  onDelete?: (qaId: string) => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (updatedQa: QA) => void;
}

/**
 * 確認ダイアログ（確認用）
 * - 確認表示
 * - 確認操作
 */
export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * チェックボックス（選択用）
 * - チェック状態表示
 * - チェック状態変更処理
 */
export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
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
 * チャット履歴（チャット履歴表示用）
 * - チャット履歴表示
 * - チャットセッション選択
 */
export interface ChatHistoryProps {
  sessions: ChatSession[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

/**
 * チャットエリア（チャット表示用）
 * - メッセージ表示
 * - メッセージ送信
 */
export interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  chatTitle: string;
}

/**
 * サイドバーメニュー項目の型定義
 */
export interface SidebarMenuItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
}

/**
 * サイドバーのプロパティ型定義
 */
export interface SidebarProps {
  menuItems: SidebarMenuItem[];
  isCollapsible?: boolean;
  selectedItem?: string;
  onSelectMenuItem?: (link: string) => void;
  defaultCollapsed?: boolean;
}

// 4.2 企業向けページ コンポーネント Props

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
 * フィルター（ダッシュボード用）
 * - フィルター条件
 */
export interface Filter {
  period: Period;
}

/**
 * ダッシュボードQ&A一覧（Q&A表示用）
 * - Q&A一覧表示
 * - Q&A選択
 */
export interface DashboardQnAListProps {
  publishedQAs: QA[];
  onSelectQA: (qaId: string) => void
}

/**
 * ダッシュボード統計（統計表示用）
 * - 統計情報表示
 */
export interface DashboardStatsProps {
  statsData: Stat[];
}

/**
 * フィルターバー（フィルター用）
 * - フィルター表示
 * - フィルター変更処理
 */
export interface FilterBarProps {
  initialFilter: Filter;
  onFilterChange: (newFilter: Filter) => void;
}

/**
 * ダッシュボードグラフ（グラフ表示用）
 * - グラフ表示
 */
export interface DashboardGraphsProps {
  graphData: GraphDataItem[];
}

/**
 * 企業基本情報フォーム（企業情報編集用）
 * - 企業情報編集
 * - 保存処理
 */
export interface CompanyInfoFormProps {
  initialData: CompanyInfo;
  onSaveSuccess: () => void;
}

/**
 * アカウント設定フォーム（アカウント設定用）
 * - プロフィール編集
 * - 保存処理
 */
export interface AccountSettingsFormProps {
  initialProfile: ProfileData;
  onSaveProfile: (updatedProfile: ProfileData) => Promise<void>;
}

/**
 * パスワード変更フォーム（パスワード変更用）
 * - パスワード変更
 */
export interface PasswordChangeFormProps {
  onChangePassword: (data: ChangePasswordRequest) => Promise<void>;
}

/**
 * 通知設定フォーム（通知設定用）
 * - 通知設定編集
 * - 保存処理
 */
export interface NotificationSettingFormProps {
  initialSetting: NotificationSetting;
  onSaveSetting: (setting: NotificationSetting) => Promise<void>;
}

/**
 * アカウント削除フォーム（アカウント削除用）
 * - アカウント削除
 */
export interface AccountDeleteFormProps {
  onDeleteAccount: (data: DeleteAccountRequest) => Promise<void>;
}

// 4.3 投資家向けページ コンポーネント Props

/**
 * 投資家ログインページ（ログイン用）
 * - ログイン表示
 * - ログイン処理
 */
export interface InvestorLoginPageProps {}

/**
 * ゲストログインボタン（ゲストログイン用）
 * - ゲストログイン処理
 */
export interface GuestLoginButtonProps {
  onGuestLoginSuccess?: () => void;
  onGuestLoginError?: (error: Error) => void;
}

/**
 * サインアップリンク（サインアップ用）
 * - サインアップリンク表示
 */
export interface LinkToSignupProps {}

/**
 * トップページ（トップ表示用）
 * - 企業一覧表示
 */
export interface TopPageProps {
  companies: Company[];
}

/**
 * 企業リスト（企業一覧表示用）
 * - 企業一覧表示
 * - フォロー操作
 */
export interface CompanyListProps {
  companies: Company[];
  onFollowToggle: (companyId: string, nextState: boolean) => void;
}

/**
 * 企業カード（企業表示用）
 * - 企業情報表示
 * - フォロー操作
 */
export interface CompanyCardProps {
  company: Company;
  onFollowToggle: (companyId: string, nextState: boolean) => void;
  onCardClick?: (companyId: string) => void;
}

/**
 * 企業ページ（企業詳細表示用）
 * - 企業詳細表示
 */
export interface CompanyPageProps {
  company: Company;
}

/**
 * 企業ヘッダー（企業ヘッダー表示用）
 * - 企業ヘッダー表示
 */
export interface CompanyHeaderProps {
  company: Company;
}

/**
 * 企業検索クエリ（企業検索用）
 * - 検索条件
 */
export interface CompanySearchQuery {
  keyword: string;
  industry?: string;
}

/**
 * 企業検索バー（企業検索用）
 * - 検索表示
 * - 検索処理
 */
export interface CompanySearchBarProps {
  initialQuery: CompanySearchQuery;
  onSearchChange: (query: CompanySearchQuery & { filter?: string; sortOrder?: 'asc' | 'desc' }) => void;
}

/**
 * チャットタブビュー（チャット表示用）
 * - チャット表示
 * - チャット履歴表示
 */
export interface ChatTabViewProps {
  companyId: CompanyId;
  initialChatHistory?: ChatMessage[];
}

/**
 * Q&Aタブビュー（Q&A表示用）
 * - Q&A表示
 */
export interface QATabViewProps {
  companyId: string;
  companyName: string;
}

/**
 * Q&A検索ページ（Q&A検索用）
 * - Q&A検索表示
 */
export interface QASearchPageProps {}

/**
 * Q&A検索バー（Q&A検索用）
 * - 検索表示
 * - 検索処理
 */
export interface QASearchBarProps {
  onSearchSubmit: (keyword: string, filters: FilterType) => void;
}

/**
 * Q&A結果リスト（Q&A一覧表示用）
 * - Q&A一覧表示
 * - Q&A操作
 */
export interface QAResultListProps {
  qas: QA[];
  onItemClick: (qa: QA) => void;
  onLike: (qaId: string) => void;
  getCompanyName: (companyId: string) => string;
  formatDate: (dateStr: string) => string;
}

/**
 * Q&A結果項目（Q&A表示用）
 * - Q&A表示
 * - Q&A操作
 */
export interface QAResultItemProps {
  qa: QA;
  onClickItem?: (qa: QA, qaId: string) => void;
  onLike?: (qaId: string) => void;
}

/**
 * チャットログページ（チャット履歴表示用）
 * - チャット履歴表示
 */
export interface ChatLogsPageProps {
  logs: ChatLog[];
}

/**
 * チャットログ検索バー（チャット履歴検索用）
 * - 検索表示
 * - 検索処理
 */
export interface ChatLogsSearchBarProps {
  onSearchSubmit: (keyword: string, filter: FilterType) => void;
}

/**
 * チャットログリスト（チャット履歴一覧表示用）
 * - チャット履歴一覧表示
 * - チャットログ操作
 */
export interface ChatLogsListProps {
  logs: ChatLog[];
  onDeleteLog?: (chatId: string) => void;
  onArchiveLog?: (chatId: string) => void;
}

/**
 * チャットログ項目（チャットログ表示用）
 * - チャットログ表示
 * - チャットログ操作
 */
export interface ChatLogItemProps {
  log: ChatLog;
  onDelete?: (chatId: string) => void;
  onArchive?: (chatId: string) => void;
}

/**
 * マイページ（ユーザーページ用）
 * - ユーザー情報表示
 */
export interface MyPageProps {
  profile: ProfileData;
}

/**
 * マイページタブメニュー（タブ切り替え用）
 * - タブ表示
 * - タブ切り替え処理
 */
export interface MyPageTabMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * プロフィールフォーム（プロフィール編集用）
 * - プロフィール編集
 * - 保存処理
 */
export interface ProfileFormProps {
  initialProfile: ProfileData;
  onSaveProfile: (updatedProfile: ProfileData) => Promise<void>;
}

/**
 * パスワードリセットリンク（パスワードリセット用）
 * - パスワードリセットリンク表示
 */
export interface PasswordResetLinkProps {
  href: string;
}

/**
 * ファイル添付セクション（ファイル添付用）
 * - ファイル添付表示
 * - ファイル操作
 */
export interface FileAttachmentSectionProps {
  attachedFiles: FileReference[];
  onAddFile: (file: File) => void;
  onRemoveFile: (fileId: string) => void;
}

/**
 * 生成Q&Aリスト（Q&A一覧表示用）
 * - 生成Q&A一覧表示
 * - Q&A操作
 */
export interface GeneratedQaListProps {
  qaDrafts: QA[];
  onUpdateDraft: (index: number, updatedQa: QA) => void;
  onDeleteDraft: (index: number) => void;
}

/**
 * ページネーション（ページ切り替え用）
 * - ページ切り替え表示
 * - ページ切り替え処理
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

/**
 * Q&Aリストカードのプロパティ
 */
export interface QaListCardsProps {
  qaItems: QA[];
  onSelect: (qaId: string) => void;
  onEdit: (qaId: string) => void;
  onDelete: (qaId: string) => Promise<void>;
}

/**
 * フィルター付きQ&Aリストカードのプロパティ
 */
export interface QaListCardsWithFilterProps {
  qaItems: QA[];
  onSelect: (qaId: string) => void;
  onEdit: (qaId: string) => void;
  onDelete: (qaId: string) => void;
  filters?: {
    tag?: string;
    genre?: string[];
    fiscalPeriod?: string[];
    sort?: 'createdAt' | 'likeCount';
    order?: 'asc' | 'desc';
    reviewStatus?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
    page?: number;
    limit?: number;
    totalCount?: number;
    totalPages?: number;
  };
  onFilterChange?: (filters: {
    tag?: string;
    genre?: string[];
    fiscalPeriod?: string[];
    sort?: 'createdAt' | 'likeCount';
    order?: 'asc' | 'desc';
    reviewStatus?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
    page?: number;
    limit?: number;
  }) => void;
}

/**
 * Q&Aリストテーブル（Q&A一覧表示用）
 * - Q&A一覧表示
 * - Q&A操作
 */
export interface QaListTableProps {
  qaItems: QA[];
  onEdit: (qaId: string) => void;
  onDelete: (qaId: string) => void;
}

/**
 * Q&Aテーブル行（Q&A表示用）
 * - Q&A表示
 * - Q&A操作
 */
export interface QaTableRowProps {
  qaItem: QA;
  onEdit: (qaId: string) => void;
  onDelete: (qaId: string) => void;
}

/**
 * フィルターオプション（フィルター用）
 * - フィルター項目定義
 */
export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'checkbox';
  options?: { value: string; label: string }[];
}

/**
 * 検索バーの並び替えオプション
 */
export interface SortOption {
  value: string;
  label: string;
}

/**
 * 検索バーのプロパティ
 */
export interface SearchBarProps {
  placeholder?: string;
  initialKeyword?: string;
  initialFilters?: Record<string, any>;
  showFilterButton?: boolean;
  className?: string;
  filterButtonLabel?: string;
  filterOptions?: FilterOption[];
  sortOptions?: SortOption[];
  filterComponent?: ReactNode;
  onSearch: (keyword: string, filters: {
    tag?: string;
    genre?: string[];
    fiscalPeriod?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    reviewStatus?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
  }) => void;
  onSort?: (sortBy: string) => void;
}

/**
 * 拡張された検索バーのプロパティ
 */
export interface EnhancedSearchBarProps extends SearchBarProps {
  sortOptions?: SortOption[];
  initialSortBy?: string;
  onSort?: (sortBy: string) => void;
}

/**
 * トップアクションバーのプロパティ
 */
export interface TopActionBarProps {
  onSearch: (params: { 
    query: string; 
    genre?: string[]; 
    tags?: string[];
    sort?: 'createdAt' | 'likeCount';
    order?: 'asc' | 'desc';
    reviewStatus?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
  }) => void;
  onUploadClick: () => void;
}

/**
 * アップロードボタン（アップロード用）
 * - アップロード表示
 * - アップロード処理
 */
export interface UploadButtonProps {
  onClick: () => void;
}

/**
 * アップロードフォーム（アップロード用）
 * - アップロード表示
 * - アップロード処理
 */
export interface UploadFormProps {
  onUploadSuccess: (qas: any[]) => void;
  onUploadError: (error: Error) => void;
  materialType: string;
  onMaterialTypeChange: (type: string) => void;
}

/**
 * アップロードモーダル（アップロード用）
 * - アップロード表示
 * - アップロード処理
 */
export interface UploadModalProps {
  onClose: () => void;
  onConfirm: (newQas: QA[]) => void;
}

/**
 * 設定タブ（設定用）
 * - 設定表示
 * - 設定処理
 */
export interface SettingsTabsProps {
  companyInfo: CompanyInfo;
  refetchCompanyInfo: () => void;
}

// =======================
// 5. ユーティリティ型
// =======================

/**
 * ページネーション（ページ管理用）
 * - ページ情報
 */
export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

/**
 * フィルタータイプ（フィルター用）
 * - フィルター条件
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
 * フィルターコントロール（フィルター用）
 * - フィルター表示
 * - フィルター変更処理
 */
export interface FilterControlsProps {
  filters: FilterType;
  onChangeFilters: (newFilters: FilterType) => void;
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

/**
 * タグオプション（タグ用）
 * - タグ定義
 */
export interface TagOption {
  label: string;
  color: string;
}

/**
 * チャット入力ボックス（チャット用）
 * - メッセージ入力
 * - メッセージ送信
 */
export interface ChatInputBoxProps {
  onSendMessage: (message: string) => void;
  loading?: boolean;
}

/**
 * チャットメッセージ（チャット用）
 * - メッセージ表示
 */
export interface ChatMessagesProps {
  messages: ChatMessage[];
}

/**
 * Q&A検索バー（Q&A検索用）
 * - 検索表示
 * - 検索処理
 */
export interface QASearchBarProps {
  onSearchSubmit: (keyword: string, filters: FilterType) => void;
  onSortChange?: (sortBy: string) => void;
  initialKeyword?: string;
  initialFilters?: FilterType;
}

/**
 * ソート順（ソート用）
 * - ソート順定義
 */
export type SortOrder = 'asc' | 'desc';

// APIレスポンス型
export interface ApiResponse<T> {
  results: T[];
  totalCount: number;
  page: number;
  limit: number;
}

// 検索関連の型
export interface SearchParams {
  keyword: string;
  genre: string[];
  source: string[];
  tag?: string;
  fiscalPeriod?: string;
  sort: 'createdAt' | 'likeCount';
  order: 'asc' | 'desc';
  page: number;
  limit: number;
}

/**
 * メッセージバブルのプロパティ型
 */
export interface MessageBubbleProps {
  message: {
    messageId: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: string;
  };
}

/**
 * メッセージリストのプロパティ型
 */
export interface MessageListProps {
  messages: {
    messageId: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: string;
  }[];
}
