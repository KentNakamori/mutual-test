// /components/ui/QACard.tsx
import React, { useState } from 'react';
import { QACardProps } from '@/types';
import { getTagColor } from '@/components/ui/tagConfig';
import { 
  Calendar, Users, FileText, HelpCircle, Bookmark, Activity, Route
} from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import GuestRestrictedContent from '@/components/features/investor/common/GuestRestrictedContent';

// ユーティリティ関数をオプションで受け取る型を拡張
export type QACardMode = 'preview' | 'detail' | 'edit';
export type QACardRole = 'investor' | 'corporate';

const QACard: React.FC<QACardProps> = ({
  mode,
  role,
  qa,
  onSelect,
  onLike,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
}) => {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [showGuestRestricted, setShowGuestRestricted] = useState(false);
  
  // ゲスト判定
  const isGuest = !user && !userLoading;
  
  // 日付の表示形式を整形する
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };
  
  const createdDate = formatDate(qa.createdAt);

  // ブックマークボタンのクリックハンドラー
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // カード全体のクリックを防止
    
    // ゲストユーザーの場合はGuestRestrictedContentを表示
    if (isGuest && role === 'investor') {
      setShowGuestRestricted(true);
      return;
    }
    
    // investor側のみブックマーク機能を有効にする
    if (role === 'investor' && onLike) {
      onLike(qa.qaId);
    }
  };

  if (showGuestRestricted) {
    return <GuestRestrictedContent 
      featureName="ブックマーク" 
      isPopup={true}
      onClose={() => setShowGuestRestricted(false)}
    />;
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100"
      onClick={() => onSelect && onSelect(qa.qaId)}
    >
      <div className="p-4">
        <div className="mb-2 border-b border-gray-200 pb-2">
          <div className="grid grid-cols-[minmax(0,600px)_1fr] items-center">
            {/* 左グループ */}
            <div className="flex items-center gap-3 overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-1">
                {qa.title}
              </h3>
              {role === 'investor' && qa.companyName && (
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                  <Users size={14} className="mr-1 text-gray-500" />
                  <span className="font-medium text-gray-700 text-sm">{qa.companyName}</span>
                </div>
              )}
              <div className="flex items-center">
                <FileText size={14} className="mr-1 text-blue-600" />
                <span className="text-gray-700 text-sm">{qa.fiscalPeriod || '未設定'}</span>
              </div>
            </div>
            {/* 右グループ */}
            <div className="flex items-center justify-between min-w-0">
              {/* 質問ルート・カテゴリ（左詰め） */}
              <div className="flex items-center gap-4 min-w-0">
                {qa.question_route && (
                  <div className="flex items-center w-28">
                    <Route size={14} className="text-indigo-600 mr-1" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(qa.question_route)}`}>
                      {qa.question_route}
                    </span>
                  </div>
                )}

                {qa.category && qa.category.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Activity size={14} className="text-amber-600" />
                    {qa.category.map((category, index) => (
                      <span 
                        key={`category-${index}`} 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(category)}`}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* 日付（右詰め） */}
              <div className="flex items-center text-gray-600 text-sm flex-shrink-0 ml-4">
                <Calendar size={14} className="mr-1" />
                <span>{createdDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* メイン内容部分 */}
        <div className="flex items-center gap-6">
          {/* 左側：質問 */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-1 rounded-full">
                <HelpCircle size={16} className="text-blue-600" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-blue-700">質問：</span>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-1">{qa.question}</p>
              </div>
            </div>
          </div>

          {/* 右側：ブックマークボタン */}
          <div className="flex items-center">
            <button
              onClick={handleBookmarkClick}
              className={`flex items-center transition-colors duration-200 ${
                role === 'investor' 
                  ? qa.isLiked 
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                  : 'text-gray-400'
              }`}
              disabled={role !== 'investor'}
            >
              <div className={`p-2 rounded-full transition-colors duration-200 ${
                role === 'investor' 
                  ? qa.isLiked 
                    ? 'bg-blue-100'
                    : 'bg-gray-100 hover:bg-blue-100'
                  : 'bg-gray-50'
              }`}>
                <Bookmark size={16} className="mr-0.5" />
              </div>
              <span className="ml-2 text-sm font-medium">{qa.likeCount || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QACard;
