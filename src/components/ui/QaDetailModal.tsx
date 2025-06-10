import React, { useState, useEffect } from 'react';
import Dialog from '@/components/ui/Dialog';
import ReactMarkdown from 'react-markdown';
import { QaDetailModalProps, QA, TagOption } from '@/types';
import {
  INFO_SOURCE_OPTIONS,
  GENRE_OPTIONS,
  QUESTION_ROUTE_OPTIONS,
  getTagColor,
} from '@/components/ui/tagConfig';
import { Calendar, Bookmark, X, BookOpen, Plus, FileText, Tag, Activity, HelpCircle, CheckCircle, Eye, Edit } from 'lucide-react';
import { updateCorporateQa, generateCorporateQaAnswer } from '@/lib/api';
import { useUser } from "@auth0/nextjs-auth0";
import FiscalPeriodSelect from '@/components/ui/FiscalPeriodSelect';
import GuestRestrictedContent from '@/components/features/investor/common/GuestRestrictedContent';

const QaDetailModal: React.FC<QaDetailModalProps> = ({
  qa,
  isOpen,
  onClose,
  role,
  onLike,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
  mode = 'view',
}) => {
  // Hooksはコンポーネントのトップレベルで呼び出す必要がある
  const { user, isLoading: userLoading } = useUser();
  const token = user?.sub ?? null; 
  const [editableQA, setEditableQA] = useState<QA>(qa || {} as QA);
  const [showSourceList, setShowSourceList] = useState(false);
  const [showGenreList, setShowGenreList] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTagList, setShowTagList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInvestorPreview, setShowInvestorPreview] = useState(false);
  const [showGuestRestricted, setShowGuestRestricted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editableGenre, setEditableGenre] = useState<string[]>(qa?.genre || []);
  const [editableSource, setEditableSource] = useState<string[]>(qa?.source || []);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // ゲスト判定
  const isGuest = !user && !userLoading;

  useEffect(() => {
    if (qa) {
      setEditableQA(qa);
      setEditableGenre(qa.genre || []);
      setEditableSource(qa.source || []);
    }
  }, [qa]);

  // 背景スクロール防止
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // qaがnullの場合は何も表示しない（Hooks呼び出し後にチェック）
  if (!qa) {
    return null;
  }

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  const handleSave = async () => {
    if (!qa) return; // qaがnullの場合は処理しない

    try {
      setIsSaving(true);

      const requestData = {
        title: editableQA.title,
        question: editableQA.question,
        answer: editableQA.answer,
        genre: editableGenre,
        source: editableSource,
        fiscalPeriod: editableQA.fiscalPeriod,
        question_route: editableQA.question_route,
        reviewStatus: editableQA.reviewStatus
      };

      console.log(`保存リクエスト: ${qa.qaId}`, requestData);

      // API経由で更新
      await updateCorporateQa(qa.qaId, requestData);

      // 保存成功時の処理
      const updatedQa = {
        ...editableQA,
        genre: editableGenre,
        source: editableSource
      };

      console.log(`保存成功: ${qa.qaId}`, updatedQa);

      // 編集モード終了
      setIsEditing(false);
      setHasChanges(false);

      if (onSaveEdit) {
        await onSaveEdit(updatedQa);
      }
    } catch (error) {
      console.error('QAの更新に失敗しました:', error);
      alert('QAの更新に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!qa) return; // qaがnullの場合は処理しない
    
    if (window.confirm('この質問を削除しますか？')) {
      try {
        console.log(`削除リクエスト: ${qa.qaId}`);
        
        // onDeleteコールバックを呼び出し
        if (onDelete) {
          onDelete(qa.qaId);
        }
        
        // モーダルを閉じる
        onClose();
      } catch (error) {
        console.error('削除処理でエラーが発生しました:', error);
        alert('削除に失敗しました');
      }
    }
  };

  const handleLike = async () => {
    if (!qa || !onLike) return; // qaがnullまたはonLikeがundefinedの場合は処理しない
    
    try {
      await onLike(qa.qaId);
    } catch (error) {
      console.error('いいね処理でエラーが発生しました:', error);
    }
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableQA({ ...editableQA, title: e.target.value });
    setHasChanges(true);
  };
  const handleChangeQuestion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableQA({ ...editableQA, question: e.target.value });
    setHasChanges(true);
  };
  const handleChangeAnswer = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableQA({ ...editableQA, answer: e.target.value });
    setHasChanges(true);
  };
  const handleChangeTag = (option: TagOption) => {
    setEditableQA({ ...editableQA, question_route: option.label });
    setHasChanges(true);
    setShowTagList(false);
  };
  const handleChangeFiscalPeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditableQA({ ...editableQA, fiscalPeriod: e.target.value });
    setHasChanges(true);
  };
  // ステータスについては、'DRAFT' / 'PENDING' / 'PUBLISHED' を使用
  const handleToggleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as QA['reviewStatus']; // 型アサーション追加
    setEditableQA({
      ...editableQA,
      reviewStatus: value,
    });
    setHasChanges(true);
  };

  // ソース操作（情報ソース）
  const handleAddSource = (option: TagOption) => {
    if (!editableQA.source.includes(option.label)) {
      setEditableQA({
        ...editableQA,
        source: [...editableQA.source, option.label],
      });
      setHasChanges(true);
    }
  };
  const handleRemoveSource = (label: string) => {
    setEditableQA({
      ...editableQA,
      source: editableQA.source.filter((t) => t !== label),
    });
    setHasChanges(true);
  };

  // 操作（ジャンル）
  const handleAddGenre = (option: TagOption) => {
    if (!editableQA.genre.includes(option.label)) {
      setEditableQA({
        ...editableQA,
        genre: [...editableQA.genre, option.label],
      });
      setHasChanges(true);
    }
  };
  const handleRemoveGenre = (label: string) => {
    setEditableQA({
      ...editableQA,
      genre: editableQA.genre.filter((g) => g !== label),
    });
    setHasChanges(true);
  };

  // AI回答生成関数
  const handleGenerateAI = async () => {
    if (!editableQA.question || !editableQA.fiscalPeriod) {
      return;
    }

    setIsGeneratingAI(true);
    setError(null);

    try {
      const response = await generateCorporateQaAnswer({
        question: editableQA.question,
        fiscalPeriod: editableQA.fiscalPeriod,
      });

      setEditableQA({
        ...editableQA,
        answer: response.answer,
        source: response.sources || [],
      });
      setHasChanges(true);
    } catch (error) {
      console.error("AI回答生成に失敗しました:", error);
      setError("AI回答の生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // AI生成ボタンの有効/無効条件を判定
  const getAIButtonStatus = () => {
    if (!editableQA.question || editableQA.question.trim() === '') {
      return { disabled: true, tooltip: '質問内容を入力してください' };
    }
    if (!editableQA.fiscalPeriod || editableQA.fiscalPeriod.trim() === '') {
      return { disabled: true, tooltip: '決算期を選択してください' };
    }
    if (editableQA.answer && editableQA.answer.trim() !== '') {
      return { disabled: true, tooltip: '回答内容が既に入力されています' };
    }
    return { disabled: false, tooltip: '' };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  // 企業名を取得する関数
  function getCompanyName(companyId: string): string {
    const companyMap: Record<string, string> = {
      comp1: 'テック・イノベーターズ株式会社',
      comp2: 'グリーンエナジー株式会社',
    };
    return companyMap[companyId] || companyId;
  }

  // モーダルのタイトル設定
  const modalTitle = role === 'corporate' && qa
    ? `QA詳細 (${qa.companyId?.includes('comp') ? getCompanyName(qa.companyId) : qa.companyName || qa.companyId})`
    : 'QA詳細';

  return (
    <>
      {showGuestRestricted && (
        <GuestRestrictedContent 
          featureName="ブックマーク" 
          isPopup={true}
          onClose={() => setShowGuestRestricted(false)}
        />
      )}

      <Dialog 
        isOpen={isOpen} 
        onClose={handleClose} 
        title="" 
        className="max-w-7xl mx-4 lg:mx-8 my-10" 
        showCloseButton={false}
      >
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {isGeneratingAI && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-lg font-medium text-gray-700">AI回答を生成中...</span>
                </div>
              </div>
            </div>
          )}

          {role === 'corporate' ? (
            <div className="relative">
              {/* Corporate用のカスタムヘッダー */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 -mt-4 mb-6">
                <h1 className="text-xl font-semibold text-gray-900">{modalTitle}</h1>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setShowInvestorPreview(false)}
                    className={`px-4 py-2 text-sm font-medium transition-colors flex items-center ${
                      !showInvestorPreview 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Edit size={16} className="mr-2" />
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInvestorPreview(true)}
                    className={`px-4 py-2 text-sm font-medium transition-colors flex items-center ${
                      showInvestorPreview 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Eye size={16} className="mr-2" />
                    プレビュー
                  </button>
                </div>
              </div>

              {showInvestorPreview ? (
                // Investor画面と同じプレビュー表示
                <div className="p-6 bg-white rounded-lg relative">
                  {/* ヘッダー情報 */}
                  <div className="mb-6 pb-4 border-b border-gray-200 pr-12">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">{editableQA.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span>{formatDate(qa.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText size={16} className="mr-2 text-gray-500" />
                        <span>{editableQA.fiscalPeriod}</span>
                      </div>
                      {editableQA.question_route && (
                        <div className="flex items-center">
                          <Tag size={16} className="mr-2 text-gray-500" />
                          <span>{editableQA.question_route}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 質問エリア */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <HelpCircle size={16} className="mr-2 text-blue-600" />
                      質問
                    </h3>
                    <p className="text-gray-800 leading-relaxed pl-6">{editableQA.question}</p>
                  </div>
                  
                  {/* 回答エリア */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      回答
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 ml-6">
                      <div className="text-gray-800 leading-relaxed prose prose-sm max-w-none">
                        <ReactMarkdown>
                          {editableQA.answer || '*回答内容を入力してください*'}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  
                  {/* メタデータエリア */}
                  <div className="space-y-4 mb-6">
                    {/* 情報ソース */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <BookOpen size={14} className="mr-2 text-gray-600" />
                        情報ソース
                      </h4>
                      <div className="flex flex-wrap gap-2 pl-5">
                        {editableQA.source && editableQA.source.length > 0 ? (
                          editableQA.source.map((source: string) => {
                            const sourceOption = INFO_SOURCE_OPTIONS.find(opt => opt.label === source);
                            const colorClass = sourceOption ? sourceOption.color : 'bg-gray-100 text-gray-800';
                            return (
                            <span
                              key={source}
                                className={`inline-flex items-center ${colorClass} px-3 py-1 rounded-full text-xs font-medium`}
                            >
                              {source}
                            </span>
                            );
                          })
                        ) : (
                          <span className="text-gray-500 text-sm">情報ソースなし</span>
                        )}
                      </div>
                    </div>
                    
                    {/* カテゴリ */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Activity size={14} className="mr-2 text-gray-600" />
                        カテゴリ
                      </h4>
                      <div className="flex flex-wrap gap-2 pl-5">
                        {editableQA.genre && editableQA.genre.length > 0 ? (
                          editableQA.genre.map((genre: string) => {
                            const genreOption = GENRE_OPTIONS.find(opt => opt.label === genre);
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
                  <div className="flex justify-end mt-4">
                    <div className="flex items-center bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
                      <Bookmark size={16} className="mr-2" />
                      <span className="font-medium">{qa.likeCount || 0}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // 編集モード（レスポンシブ対応）
                <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 p-4 sm:p-6 overflow-x-hidden">
                  {/* 左側：メタデータ編集 */}
                  <div className="lg:col-span-2 space-y-5 min-w-0">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">質問タイトル</label>
                      <input
                        type="text"
                        name="title"
                        value={editableQA.title}
                        onChange={handleChangeTitle}
                        className="w-full min-w-0 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">決算期</label>
                      <div className="w-full min-w-0">
                        <FiscalPeriodSelect
                          value={editableQA.fiscalPeriod || ''}
                          onChange={(value) => {
                            setEditableQA({ ...editableQA, fiscalPeriod: value });
                            setHasChanges(true);
                          }}
                          includeEmpty={true}
                          className="w-full min-w-0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">質問ルート</label>
                      <select
                        name="question_route"
                        value={editableQA.question_route || ''}
                        onChange={(e) => handleChangeTag({ label: e.target.value } as TagOption)}
                        className="w-full min-w-0 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">質問ルートを選択</option>
                        {QUESTION_ROUTE_OPTIONS.map((option) => (
                          <option key={option.label} value={option.label}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
                      <select
                        name="status"
                        value={editableQA.reviewStatus}
                        onChange={handleToggleStatus}
                        className={`w-full min-w-0 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          editableQA.reviewStatus === 'DRAFT' ? 'bg-yellow-50 border-yellow-200' :
                          editableQA.reviewStatus === 'PENDING' ? 'bg-orange-50 border-orange-200' :
                          editableQA.reviewStatus === 'PUBLISHED' ? 'bg-green-50 border-green-200' : ''
                        }`}
                      >
                        <option value="DRAFT" className="text-yellow-700">下書き</option>
                        <option value="PENDING" className="text-orange-700">非公開</option>
                        <option value="PUBLISHED" className="text-green-700">公開</option>
                    </select>
                      <p className="mt-1 text-xs text-gray-500">
                        {editableQA.reviewStatus === 'DRAFT' ? '下書き状態です。編集可能です。' :
                         editableQA.reviewStatus === 'PENDING' ? '非公開状態です。公開するには承認が必要です。' :
                         '公開状態です。投資家に表示されます。'}
                      </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">情報ソース</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editableQA.source.map((source) => (
                        <div key={source} className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                          <BookOpen size={12} className="mr-1" />
                          {source}
                          <button
                            onClick={() => handleRemoveSource(source)}
                            className="ml-1 text-gray-600 hover:text-gray-800"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">情報ソース</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editableQA.source.map((source) => (
                          <div key={source} className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                            <BookOpen size={12} className="mr-1" />
                            <span className="truncate max-w-[120px]">{source}</span>
                            <button
                              onClick={() => handleRemoveSource(source)}
                              className="ml-1 text-gray-600 hover:text-gray-800 flex-shrink-0"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowSourceList(!showSourceList)}
                          className="flex items-center text-sm px-2 py-1 rounded border bg-white hover:bg-gray-50"
                        >
                          <Plus size={14} className="mr-1" />
                          ソースを追加
                        </button>
                        {showSourceList && (
                          <div className="absolute z-10 mt-1 w-full max-w-64 bg-white rounded-md shadow-lg border py-1 max-h-48 overflow-y-auto">
                            {INFO_SOURCE_OPTIONS.filter(option => !editableQA.source.includes(option.label))
                              .map((option) => (
                                <button
                                  key={option.label}
                                  onClick={() => {
                                    handleAddSource(option);
                                    setShowSourceList(false);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 truncate"
                                >
                                  {option.label}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editableQA.genre.map((g) => (
                          <div key={g} className={`inline-flex items-center ${getTagColor(g)} px-2 py-1 rounded-md text-xs`}>
                            <span className="truncate max-w-[120px]">{g}</span>
                            <button
                              onClick={() => handleRemoveGenre(g)}
                              className="ml-1 text-gray-600 hover:text-gray-800 flex-shrink-0"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowGenreList(!showGenreList)}
                          className="flex items-center text-sm px-2 py-1 rounded border bg-white hover:bg-gray-50"
                        >
                          <Plus size={14} className="mr-1" />
                          カテゴリを追加
                        </button>
                        {showGenreList && (
                          <div className="absolute z-10 mt-1 w-full max-w-64 bg-white rounded-md shadow-lg border py-1 max-h-48 overflow-y-auto">
                            {GENRE_OPTIONS.filter(option => !editableQA.genre.includes(option.label))
                              .map((option) => (
                                <button
                                  key={option.label}
                                  onClick={() => {
                                    handleAddGenre(option);
                                    setShowGenreList(false);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 truncate"
                                >
                                  {option.label}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // 投資家向けUI（企業プレビューと統一）
            <div className="p-6 bg-white rounded-lg relative">
              {/* 投資家向けモーダル用の閉じるボタン */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="モーダルを閉じる"
              >
                <X size={20} />
              </button>
              
              {/* ヘッダー情報 */}
              <div className="mb-6 pb-4 border-b border-gray-200 pr-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{qa.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <span>{formatDate(qa.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText size={16} className="mr-2 text-gray-500" />
                    <span>{qa.fiscalPeriod}</span>
                  </div>
                  {qa.question_route && (
                    <div className="flex items-center">
                      <Tag size={16} className="mr-2 text-gray-500" />
                      <span>{qa.question_route}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 質問エリア */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                  <HelpCircle size={16} className="mr-2" />
                  質問
                </h3>
                <p className="text-gray-800 leading-relaxed">{qa.question}</p>
              </div>
              
              {/* 回答エリア */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  回答
                </h3>
                <div className="text-gray-800 leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {qa.answer}
                  </ReactMarkdown>
                </div>
              </div>
              
              {/* メタデータエリア */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* 情報ソース */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <BookOpen size={14} className="mr-2 text-gray-600" />
                    情報ソース
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {qa.source.map((source: string) => (
                      <span 
                        key={source}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* カテゴリ */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Activity size={14} className="mr-2 text-gray-600" />
                    カテゴリ
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {qa.genre.map((genre: string) => (
                      <span 
                        key={genre}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* ブックマークボタン */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    role === 'investor' 
                      ? qa.isLiked 
                        ? 'bg-blue-100 text-blue-700 shadow-sm' 
                        : 'bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600' 
                      : 'bg-gray-100 text-gray-400 cursor-default' 
                  }`}
                  disabled={role !== 'investor'}
                >
                  <Bookmark size={16} className="mr-2" />
                  <span className="font-medium">{qa.likeCount || 0}</span>
                </button>
              </div>
            </div>
          )}

          {role === 'corporate' && (
            <div className="flex justify-end space-x-2 px-4 py-3 bg-white border-t">
              <button 
                onClick={handleClose} 
                className="py-2 px-4 border rounded hover:bg-gray-100 transition-colors"
                disabled={isSaving}
              >
                キャンセル
              </button>
              <button 
                onClick={handleDelete} 
                className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                disabled={isSaving}
              >
                削除
              </button>
              <button 
                onClick={handleSave} 
                className={`py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSaving}
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
            </div>
          )}
        </div>
      </Dialog>

      {showConfirmDialog && (
        <Dialog
          isOpen={showConfirmDialog}
          onClose={handleCancelClose}
          title="変更の確認"
          className="max-w-md mx-4"
          showCloseButton={false}
        >
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              変更内容が保存されていません。本当に閉じますか？
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                戻る
              </button>
              <button
                onClick={handleConfirmClose}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                保存せず閉じる
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default QaDetailModal;
