import { QA } from '../models';
import { FilterType } from '../common';

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
  onSortChange?: (sortBy: string) => void;
  initialKeyword?: string;
  initialFilters?: FilterType;
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
 * 生成Q&Aリスト（Q&A一覧表示用）
 * - 生成Q&A一覧表示
 * - Q&A操作
 */
export interface GeneratedQaListProps {
  qaDrafts: QA[];
  onUpdateDraft: (index: number, updatedQa: QA) => void;
  onDeleteDraft: (index: number) => void;
} 