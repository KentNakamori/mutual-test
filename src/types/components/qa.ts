import { QA, Company } from '../models';

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
 * Q&A詳細モーダル（Q&A詳細表示・編集用）
 * - Q&A詳細表示
 * - Q&A編集（企業向け）
 * - いいね機能
 */
export interface QaDetailModalProps {
  qa: QA | null;
  isOpen: boolean;
  onClose: () => void;
  role?: string;
  onLike?: (qaId: string) => Promise<void>;
  onEdit?: (qa: QA) => Promise<void>;
  onDelete?: (qaId: string) => Promise<void>;
  onCancelEdit?: () => void;
  onSaveEdit?: (qa: QA) => Promise<void>;
  mode?: 'view' | 'edit';
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
export interface QASearchPageProps {
  // Q&A検索ページのプロパティを必要に応じて追加
}

/**
 * Q&A検索バー（Q&A検索用）
 * - キーワード検索
 * - フィルター機能
 * - ソート機能
 */
export interface QaSearchBarProps {
  onSearchSubmit?: (keyword: string, newFilters: any) => void;
  onSortChange?: (sortValue: string) => void;
  initialKeyword?: string;
  initialFilters?: any;
  onSearch?: (query: string) => void;
  onFilter?: (filters: QaFilterOptions) => void;
  onSort?: (sortOption: QaSortOption) => void;
  placeholder?: string;
  filters?: QaFilterOptions;
  sortOption?: QaSortOption;
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
    question_route?: string;
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
    question_route?: string;
    genre?: string[];
    fiscalPeriod?: string[];
    sort?: 'createdAt' | 'likeCount';
    order?: 'asc' | 'desc';
    reviewStatus?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
    page?: number;
    limit?: number;
    totalCount?: number;
    totalPages?: number;
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
 * Q&Aフィルターオプション
 */
export interface QaFilterOptions {
  companies?: string[];
  genres?: string[];
  fiscalPeriods?: string[];
  status?: ('draft' | 'published' | 'archived')[];
  dateRange?: {
    from?: string;
    to?: string;
  };
}

/**
 * Q&Aソートオプション
 */
export interface QaSortOption {
  field: 'createdAt' | 'updatedAt' | 'likeCount' | 'title';
  order: 'asc' | 'desc';
}

/**
 * Q&A作成・編集フォーム（企業向けQ&A管理用）
 * - Q&A作成
 * - Q&A編集
 * - 下書き保存
 */
export interface QaFormProps {
  qa?: QA;
  onSave: (qa: Partial<QA>) => Promise<void>;
  onCancel: () => void;
  companies: Company[];
  mode: 'create' | 'edit';
}

/**
 * Q&A一覧コンポーネント（Q&A表示用）
 * - Q&A一覧表示
 * - ページング
 * - 検索・フィルター連携
 */
export interface QaListProps {
  qas?: QA[];
  items?: QA[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onQaSelect?: (qa: QA) => void;
  onSelectQA?: (qa: QA) => void;
  onQaEdit?: (qa: QA) => void;
  onQaDelete?: (qaId: string) => void;
  mode?: 'investor' | 'corporate';
  loading?: boolean;
} 