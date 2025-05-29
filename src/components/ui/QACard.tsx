// /components/ui/QACard.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { QA, QACardProps } from '@/types';
import { getTagColor } from '@/components/ui/tagConfig';
import { 
  Calendar, Users, FileText, HelpCircle, CheckCircle, 
  BookOpen, ThumbsUp, Clock, Tag, Activity, Route
} from 'lucide-react';
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

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100"
      onClick={() => onSelect && onSelect(qa.qaId)}
    >
      <div className="p-4">
        {/* ヘッダー部分 - タイトルと基本情報 */}
        <div className="mb-2 border-b border-gray-200 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
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
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar size={14} className="mr-1" />
              <span>{createdDate}</span>
            </div>
          </div>
        </div>

        {/* メイン内容部分 */}
        <div className="flex gap-6">
          {/* 左側：質問と回答 */}
          <div className="w-3/5 space-y-2">
            {/* 質問 */}
            <div>
              <div className="flex items-center mb-1">
                <div className="bg-blue-50 p-1 rounded-full mr-2">
                  <HelpCircle size={16} className="text-blue-600" />
                </div>
                <h4 className="text-base font-medium text-blue-700">質問</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 pl-8">{qa.question}</p>
            </div>

            {/* 回答 */}
            <div>
              <div className="flex items-center mb-1">
                <div className="bg-green-50 p-1 rounded-full mr-2">
                  <CheckCircle size={16} className="text-green-600" />
                </div>
                <h4 className="text-base font-medium text-green-700">回答</h4>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed markdown-card-preview prose prose-sm max-w-none pl-8">
                <ReactMarkdown>
                  {qa.answer}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* 右側：メタデータ */}
          <div className="w-2/5 space-y-2 text-sm relative">
            {/* 質問ルート */}
            {qa.question_route && (
              <div>
                <div className="flex items-center mb-1">
                  <Route size={14} className="mr-1 text-indigo-600" />
                  <span className="font-medium text-gray-700">質問ルート</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(qa.question_route)}`}>
                  {qa.question_route}
                </span>
              </div>
            )}

            {/* カテゴリ */}
            {qa.genre && qa.genre.length > 0 && (
              <div>
                <div className="flex items-center mb-1">
                  <Activity size={14} className="mr-1 text-amber-600" />
                  <span className="font-medium text-gray-700">カテゴリ</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {qa.genre.map((genre, index) => (
                    <span 
                      key={`genre-${index}`} 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(genre)}`}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 情報ソース */}
            {qa.source && qa.source.length > 0 && (
              <div>
                <div className="flex items-center mb-1">
                  <BookOpen size={14} className="mr-1 text-purple-600" />
                  <span className="font-medium text-gray-700">情報ソース</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {qa.source.map((source, index) => (
                    <span
                      key={`source-${index}`} 
                      className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* いいねボタン - 右下に配置 */}
            <div className="absolute bottom-0 right-0">
              {/* ゲストユーザーの場合の表示 */}
              {isGuest && role === 'investor' ? (
                <button
                  onClick={handleLikeClick}
                  className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  title="いいねするにはログインが必要です"
                >
                  <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                    <ThumbsUp size={16} className="mr-0.5" />
                  </div>
                  <span className="ml-2 text-sm font-medium">{qa.likeCount || 0}</span>
                  <span className="ml-2 text-sm text-gray-500">ログインが必要</span>
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
                    <ThumbsUp size={16} className="mr-0.5" />
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
};

export default QACard;
