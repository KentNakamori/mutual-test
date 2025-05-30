import { QA, CompanyInfo, ProfileData, NotificationSetting, Stat, GraphDataItem } from '../models';

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
 * フィルター（ダッシュボード用）
 * - フィルター条件
 */
export interface Filter {
  period: "daily" | "weekly" | "monthly";
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
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
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
  onDeleteAccount: (data: { password: string }) => Promise<void>;
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
 * トップアクションバーのプロパティ
 */
export interface TopActionBarProps {
  onSearch: (params: { 
    query: string; 
    genre?: string[]; 
    question_route?: string;
    fiscalPeriod?: string[];
    sort?: 'createdAt' | 'likeCount';
    order?: 'asc' | 'desc';
    reviewStatus?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
  }) => void;
  onUploadClick: () => void;
}

/**
 * ファイル添付セクション（ファイル添付用）
 * - ファイル添付表示
 * - ファイル操作
 */
export interface FileAttachmentSectionProps {
  attachedFiles: { fileId: string; fileName: string; url: string; uploadedAt: string }[];
  onAddFile: (file: File) => void;
  onRemoveFile: (fileId: string) => void;
} 