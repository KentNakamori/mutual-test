import React from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { QA } from '@/types';
import {
  CATEGORY_OPTION,
  QUESTION_ROUTE_OPTIONS,
} from '@/components/ui/tagConfig';
import { Calendar, Bookmark, FileText, Activity, HelpCircle, CheckCircle, Route, Users } from 'lucide-react';
import { formatDate, getCompanyName } from './qaUtils';

interface QaPreviewProps {
  qa: Partial<QA> & {
    title: string;
    question: string;
    answer: string;
    fiscalPeriod?: string;
    question_route?: string;
    category?: string[];
    source?: string[];
    createdAt?: string;
    companyId?: string;
    companyName?: string;
    likeCount?: number;
    isLiked?: boolean;
  };
  role?: 'corporate' | 'investor';
  onLike?: () => void;
  showLikeButton?: boolean;
}

const QaPreview: React.FC<QaPreviewProps> = ({ 
  qa, 
  role = 'corporate', 
  onLike, 
  showLikeButton = true 
}) => {
  const displayDate = qa.createdAt ? formatDate(qa.createdAt) : formatDate(new Date().toISOString());
  const displayCompanyName = qa.companyName || (qa.companyId ? getCompanyName(qa.companyId) : 'Company A');

  // 企業のQAリストページへのリンクを生成
  const companyQaLink = qa.companyId ? `/investor/company/${qa.companyId}?tab=qa` : null;

  return (
    <div className="p-6 bg-white rounded-lg relative">
      {/* ヘッダー情報 */}
      <div className="mb-6 pb-4 border-b border-gray-200 pr-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">{qa.title || 'タイトル未入力'}</h2>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Users size={16} className="mr-2 text-gray-500" />
            {role === 'investor' && companyQaLink ? (
              <Link 
                href={companyQaLink} 
                className="font-medium hover:text-gray-800 cursor-pointer"
              >
                {displayCompanyName}
              </Link>
            ) : (
              <span className="font-medium">{displayCompanyName}</span>
            )}
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-gray-500" />
            <span>{displayDate}</span>
          </div>
          <div className="flex items-center">
            <FileText size={16} className="mr-2 text-gray-500" />
            <span>{qa.fiscalPeriod || '未選択'}</span>
          </div>
        </div>
      </div>
      
      {/* 質問エリア */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-600 mb-2 flex items-center">
          <HelpCircle size={24} className="mr-2 text-blue-600" />
          質問
        </h3>
        <p className="text-gray-800 leading-relaxed pl-6">{qa.question || '質問内容を入力してください'}</p>
      </div>
      
      {/* 回答エリア */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-green-600 mb-2 flex items-center">
          <CheckCircle size={24} className="mr-2 text-green-600" />
          回答
        </h3>
        <div className="ml-6">
          <div className="text-gray-800 leading-relaxed prose prose-sm max-w-none">
            <ReactMarkdown>
              {qa.answer || '*回答内容を入力してください*'}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      
      {/* メタデータエリア */}
      <div className="space-y-4 mb-6">
        {/* 質問ルート */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Route size={14} className="mr-2 text-indigo-600" />
            質問ルート
          </h4>
          <div className="flex flex-wrap gap-2 pl-5">
            {qa.question_route ? (
              (() => {
                const routeOption = QUESTION_ROUTE_OPTIONS.find(opt => opt.label === qa.question_route);
                const colorClass = routeOption ? routeOption.color : 'bg-gray-100 text-gray-800';
                return (
                  <span
                    className={`inline-flex items-center ${colorClass} px-3 py-1 rounded-full text-xs font-medium`}
                  >
                    {qa.question_route}
                  </span>
                );
              })()
            ) : (
              <span className="text-gray-500 text-sm">質問ルート未設定</span>
            )}
          </div>
        </div>
        
        {/* カテゴリ */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Activity size={14} className="mr-2 text-amber-600" />
            カテゴリ
          </h4>
          <div className="flex flex-wrap gap-2 pl-5">
            {qa.category && qa.category.length > 0 ? (
              qa.category.map((genre: string) => {
                const genreOption = CATEGORY_OPTION.find(opt => opt.label === genre);
                const colorClass = genreOption ? genreOption.color : 'bg-gray-100 text-gray-800';
                return (
                <span
                  key={genre}
                    className={`inline-flex items-center ${colorClass} px-3 py-1 rounded-full text-xs font-medium`}
                >
                  {genre}
                </span>
                );
              })
            ) : (
              <span className="text-gray-500 text-sm">カテゴリ未設定</span>
            )}
          </div>
        </div>
      </div>
      
      {/* ブックマークボタン */}
      {showLikeButton && (
        <div className="flex justify-end mt-4">
          <button
            onClick={onLike}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              role === 'investor' 
                ? qa.isLiked 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600' 
                : 'bg-gray-100 text-gray-600' 
            }`}
            disabled={role !== 'investor'}
          >
            <Bookmark size={16} className="mr-2" />
            <span className="font-medium">{qa.likeCount || 0}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QaPreview; 