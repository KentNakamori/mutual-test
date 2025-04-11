// /components/ui/QACard.tsx
import React from 'react';
import { QA, QACardProps } from '@/types';
import Card from '@/components/ui/Card';
import { getTagColor } from '@/components/ui/tagConfig';
import { Calendar, Users, FileText, HelpCircle, CheckCircle, BookOpen, ThumbsUp } from 'lucide-react';

// ユーティリティ関数をオプションで受け取る型を拡張
export type QACardMode = 'preview' | 'detail' | 'edit';
export type QACardRole = 'investor' | 'corporate';

interface ExtendedQACardProps extends QACardProps {
  getCompanyName?: (companyId: string) => string;
  formatDate?: (dateStr: string) => string;
}

const QACard: React.FC<ExtendedQACardProps> = ({
  mode,
  role,
  qa,
  onSelect,
  onLike,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
  getCompanyName,
  formatDate,
}) => {
  // デフォルトで生の companyId や createdAt を表示しないようにユーティリティで加工
  const companyName = getCompanyName ? getCompanyName(qa.companyId) : qa.companyId;
  const createdDate = formatDate ? formatDate(qa.createdAt) : qa.createdAt;


if (mode === 'preview') {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={() => onSelect && onSelect(qa.qaId)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
            {qa.title}
          </h3>
          <div className="text-sm font-medium text-gray-500 flex items-center">
            <Calendar size={14} className="mr-1" />
            {createdDate}
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="text-sm text-gray-600 flex items-center">
            <Users size={14} className="mr-1.5 text-gray-500" />
            <span className="font-medium">{companyName}</span>
          </div>
          <div className="mx-2 text-gray-300">|</div>
          <div className="text-sm text-gray-600 flex items-center">
            <FileText size={14} className="mr-1.5 text-gray-500" />
            <span>{qa.fiscalPeriod}</span>
          </div>
        </div>
        
        {/* 質問と回答の間の空白を狭めるために外側マージンを mb-1 に変更 */}
        <div className="mb-2">
          <div className="flex items-start space-x-2 mb-0">
            <HelpCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{qa.question}</p>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex items-start space-x-2">
            <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{qa.answer}</p>
          </div>
        </div>
        {/* 回答と情報ソースの間の隙間を広げるために mb-3 を mb-5 に変更 */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {qa.tags && qa.tags.map((source, index) => (
            <span 
              key={`source-${index}`} 
              className={`px-2 py-1 rounded-md text-xs flex items-center ${getTagColor(source)}`}
            >
              <BookOpen size={10} className="mr-1" />
              {source}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1.5">
            {qa.genre && qa.genre.map((genre, index) => (
              <span 
                key={`genre-${index}`} 
                className={`px-2 py-0.5 rounded-md text-xs ${getTagColor(genre)}`}
              >
                {genre}
              </span>
            ))}
          </div>
          
          <div className="flex items-center text-sm">
            <ThumbsUp 
              size={14} 
              className="mr-1 text-gray-400 cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                onLike && onLike(qa.qaId);
              }}
            />
            <span className="text-gray-500">{qa.likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}



  return null;
};
export default QACard;
