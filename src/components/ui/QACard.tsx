// /components/ui/QACard.tsx
import React from 'react';
import { QA, QACardProps } from '@/types';
import { getTagColor } from '@/components/ui/tagConfig';
import { Calendar, Users, FileText, HelpCircle, CheckCircle, BookOpen, ThumbsUp } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';

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
  
  // ゲスト判定
  const isGuest = !user && !userLoading;
  
  // 日付の表示形式を整形する
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };
  
  const createdDate = formatDate(qa.createdAt);

  // いいねボタンのクリックハンドラー
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // カード全体のクリックを防止
    
    // ゲストユーザーの場合はAuth0のログイン画面へ
    if (isGuest && role === 'investor') {
      const returnTo = typeof window !== 'undefined' ? window.location.pathname : '/investor/qa';
      router.push(`/api/auth/investor-login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    
    // investor側のみいいね機能を有効にする
    if (role === 'investor' && onLike) {
      onLike(qa.qaId);
    }
  };

if (mode === 'preview') {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100"
      onClick={() => onSelect && onSelect(qa.qaId)}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左側：メタ情報 */}
          <div className="w-full md:w-1/4 space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2">
                  {qa.title}
                </h3>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                  <Users size={14} className="mr-1.5 text-gray-500" />
                  <span className="font-medium">{qa.companyName}</span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-1.5" />
                <span>{createdDate}</span>
                <span className="mx-2 text-gray-300">|</span>
                <FileText size={14} className="mr-1.5" />
                <span>{qa.fiscalPeriod}</span>
              </div>
            </div>

            <div className="space-y-2">
              {/* 質問ルートの表示 */}
              {qa.question_route && (
                <div className="flex flex-wrap gap-1.5">
                  <span 
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${getTagColor(qa.question_route)}`}
                  >
                    {qa.question_route}
                  </span>
                </div>
              )}

              {/* ジャンルの表示 */}
              <div className="flex flex-wrap gap-1.5">
                {qa.genre && qa.genre.map((genre, index) => (
                  <span 
                    key={`genre-${index}`} 
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTagColor(genre)}`}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 右側：質問と回答 */}
          <div className="w-full md:w-3/4 space-y-2">
            <div className="rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-1.5 rounded-full">
                  <HelpCircle size={18} className="text-blue-600" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{qa.question}</p>
              </div>
            </div>
            
            <div className="rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-1.5 rounded-full">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{qa.answer}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-1.5">
                {qa.source && qa.source.map((source, index) => (
                  <span 
                    key={`source-${index}`} 
                    className="text-xs text-gray-500 px-2 py-0.5 bg-gray-50 rounded-full flex items-center"
                  >
                    <BookOpen size={12} className="mr-1" />
                    {source}
                  </span>
                ))}
              </div>

              {/* ゲストユーザーの場合の表示 */}
              {isGuest && role === 'investor' ? (
                <button
                  onClick={handleLikeClick}
                  className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  title="いいねするにはログインが必要です"
                >
                  <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                    <ThumbsUp size={16} className="mr-1" />
                  </div>
                  <span className="ml-2 text-sm font-medium">{qa.likeCount || 0}</span>
                  <span className="ml-2 text-xs text-gray-500">ログインが必要</span>
                </button>
              ) : (
                <button
                  onClick={handleLikeClick}
                  className={`flex items-center transition-colors duration-200 ${
                    role === 'investor' 
                      ? qa.isLiked 
                        ? 'text-blue-600' // いいね済みの場合は青色
                        : 'text-gray-600 hover:text-blue-600' // 未いいねの場合はグレー、ホバーで青
                      : 'text-gray-400' // 企業側は無効状態
                  }`}
                  disabled={role !== 'investor'}
                >
                  <div className={`p-2 rounded-full transition-colors duration-200 ${
                    role === 'investor' 
                      ? qa.isLiked 
                        ? 'bg-blue-100' // いいね済みの場合は青背景
                        : 'bg-gray-100 hover:bg-blue-100' // 未いいねの場合はグレー背景、ホバーで青背景
                      : 'bg-gray-50' // 企業側は無効状態
                  }`}>
                    <ThumbsUp size={16} className="mr-1" />
                  </div>
                  <span className="ml-2 text-sm font-medium">{qa.likeCount || 0}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  return null;
};
export default QACard;
