import React, { useState, useEffect } from 'react';
import Dialog from '@/components/ui/Dialog';
import { QADetailModalProps, QA, TagOption } from '@/types';
import {
  INFO_SOURCE_OPTIONS,
  GENRE_OPTIONS,
  TAG_OPTIONS,
  getTagColor,
} from '@/components/ui/tagConfig';
import { Calendar, ThumbsUp, X, BookOpen, Plus, Clock, FileText, Tag, Activity, HelpCircle, CheckCircle } from 'lucide-react';
import { updateCorporateQa, deleteCorporateQa } from '@/libs/api';
import { useAuth } from '@/hooks/useAuth';

const QaDetailModal: React.FC<QADetailModalProps> = ({
  qa,
  isOpen,
  onClose,
  role,
  onLike,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
}) => {
  const { token } = useAuth();
  const [editableQA, setEditableQA] = useState<QA>({ ...qa });
  const [showSourceList, setShowSourceList] = useState(false);
  const [showGenreList, setShowGenreList] = useState(false);
  const [showTagList, setShowTagList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditableQA({ ...qa });
      setHasChanges(false);
    }
  }, [qa, isOpen]);

  // 背景スクロール防止
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm("変更内容が保存されていません。本当に閉じますか？")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!token) {
      setError("認証トークンがありません");
      return;
    }
    if (isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      // ステータスを管理する (大文字に変更)
      const reviewStatus = editableQA.reviewStatus as QA['reviewStatus']; // 直接 reviewStatus を使用

      // リクエストデータを構築
      const requestData = {
        title: editableQA.title,
        question: editableQA.question,
        answer: editableQA.answer,
        tag: editableQA.tag, // tag を追加
        source: editableQA.source, // tags -> source
        genre: editableQA.genre,
        fiscalPeriod: editableQA.fiscalPeriod,
        reviewStatus: reviewStatus, // reviewStatus をそのまま使用
        // isFAQ: !!editableQA.isFAQ // isFAQ削除
      };
      
      // デバッグ情報
      console.log(`保存リクエスト: ${qa.qaId}`, requestData);
      
      // API呼び出し
      await updateCorporateQa(token, qa.qaId, requestData);
      
      // 更新したQAをコールバックで返す
      const updatedQa: QA = {
        ...qa, // 元のQAのデータを保持
        ...editableQA, // 編集したデータで上書き
        reviewStatus: reviewStatus, // 明示的にreviewStatusを設定
        // isPublished: reviewStatus === 'published', // 削除 (QA型から削除)
        updatedAt: new Date().toISOString() // 更新日時を現在時刻に
      };
      
      console.log(`保存成功: ${qa.qaId}`, updatedQa);
      
      onSaveEdit && onSaveEdit(updatedQa);
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error("QAの更新に失敗しました:", error);
      setError("QAの更新に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token) {
      setError("認証トークンがありません");
      return;
    }
    if (window.confirm("本当に削除しますか？")) {
      try {
        // デバッグ情報
        console.log(`削除リクエスト: ${qa.qaId}`);
        
        // 親コンポーネントに削除を委譲
        onDelete && onDelete(qa.qaId);
        
        // モーダルを閉じる (親コンポーネントが閉じるため不要)
        // onClose();
      } catch (error) {
        console.error("QAの削除に失敗しました:", error);
        setError("QAの削除に失敗しました");
      }
    }
  };

  const handleLike = () => {
    // investor側のみいいね機能を有効にする
    if (role === 'investor' && onLike) {
      onLike(qa.qaId);
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
    setEditableQA({ ...editableQA, tag: option.label });
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
  const modalTitle = role === 'investor' 
    ? `QA詳細 (${qa.companyId?.includes('comp') ? getCompanyName(qa.companyId) : qa.companyName || qa.companyId})`
    : 'QA詳細';

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title={modalTitle} className="max-w-6xl my-10" showCloseButton={false}>
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {role === 'corporate' ? (
          <div className="grid grid-cols-5 gap-6 p-6">
            {/* 左側：メタデータ編集 */}
            <div className="col-span-2 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">質問タイトル</label>
                <input
                  type="text"
                  name="title"
                  value={editableQA.title}
                  onChange={handleChangeTitle}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">決算期</label>
                  <select
                    name="fiscalPeriod"
                    value={editableQA.fiscalPeriod}
                    onChange={handleChangeFiscalPeriod}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="2025-Q1">2025年度 Q1</option>
                    <option value="2025-Q2">2025年度 Q2</option>
                    <option value="2025-Q3">2025年度 Q3</option>
                    <option value="2025-Q4">2025年度 Q4</option>
                    <option value="2026-Q1">2026年度 Q1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">タグ</label>
                  <select
                    name="tag"
                    value={editableQA.tag}
                    onChange={(e) => handleChangeTag({ label: e.target.value } as TagOption)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">タグを選択</option>
                    {TAG_OPTIONS.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                <select
                  name="status"
                  value={editableQA.reviewStatus}
                  onChange={handleToggleStatus}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DRAFT">下書き</option>
                  <option value="PENDING">非公開</option>
                  <option value="PUBLISHED">公開</option>
                </select>
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
                <div className="relative">
                  <button
                    onClick={() => setShowSourceList(!showSourceList)}
                    className="flex items-center text-sm px-2 py-1 rounded border bg-white hover:bg-gray-50"
                  >
                    <Plus size={14} className="mr-1" />
                    ソースを追加
                  </button>
                  {showSourceList && (
                    <div className="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg border py-1 max-h-48 overflow-y-auto">
                      {INFO_SOURCE_OPTIONS.filter(option => !editableQA.source.includes(option.label))
                        .map((option) => (
                          <button
                            key={option.label}
                            onClick={() => {
                              handleAddSource(option);
                              setShowSourceList(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {option.label}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ジャンル</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editableQA.genre.map((g) => (
                    <div key={g} className={`inline-flex items-center ${getTagColor(g)} px-2 py-1 rounded-md text-xs`}>
                      {g}
                      <button
                        onClick={() => handleRemoveGenre(g)}
                        className="ml-1 text-gray-600 hover:text-gray-800"
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
                    ジャンルを追加
                  </button>
                  {showGenreList && (
                    <div className="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg border py-1 max-h-48 overflow-y-auto">
                      {GENRE_OPTIONS.filter(option => !editableQA.genre.includes(option.label))
                        .map((option) => (
                          <button
                            key={option.label}
                            onClick={() => {
                              handleAddGenre(option);
                              setShowGenreList(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {option.label}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 右側：質問内容・回答編集 */}
            <div className="col-span-3 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">質問内容</label>
                <textarea
                  name="question"
                  value={editableQA.question}
                  onChange={handleChangeQuestion}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">回答内容</label>
                <textarea
                  name="answer"
                  value={editableQA.answer}
                  onChange={handleChangeAnswer}
                  rows={12}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        ) : (
          // 投資家向けUI（見やすく改善）
          <div className="p-6 bg-white rounded-lg">
            {/* ヘッダー情報 */}
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{qa.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-blue-500" />
                  <span>{formatDate(qa.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <FileText size={16} className="mr-2 text-blue-500" />
                  <span>{qa.fiscalPeriod}</span>
                </div>
                {qa.tag && (
                  <div className="flex items-center">
                    <Tag size={16} className="mr-2 text-blue-500" />
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor(qa.tag)}`}>
                      {qa.tag}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* 質問エリア */}
            <div className="mb-6 p-5 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                <HelpCircle size={18} className="mr-2" />
                質問
              </h3>
              <p className="text-gray-700">{qa.question}</p>
            </div>
            
            {/* 回答エリア */}
            <div className="mb-6 p-5 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-3 flex items-center">
                <CheckCircle size={18} className="mr-2" />
                回答
              </h3>
              <div className="text-gray-700 whitespace-pre-line">{qa.answer}</div>
            </div>
            
            {/* メタデータエリア */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* 情報ソース */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <BookOpen size={16} className="mr-2 text-purple-600" />
                  情報ソース
                </h4>
                <div className="flex flex-wrap gap-2">
                  {qa.source && qa.source.length > 0 ? (
                    qa.source.map((source) => (
                      <span
                        key={source}
                        className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs"
                      >
                        {source}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">情報ソースなし</span>
                  )}
                </div>
              </div>
              
              {/* ジャンル */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Activity size={16} className="mr-2 text-amber-600" />
                  ジャンル
                </h4>
                <div className="flex flex-wrap gap-2">
                  {qa.genre && qa.genre.length > 0 ? (
                    qa.genre.map((genre) => (
                      <span
                        key={genre}
                        className={`inline-flex items-center ${getTagColor(genre)} px-2 py-1 rounded-md text-xs`}
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">ジャンル未設定</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* いいねボタン */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleLike}
                className={`flex items-center ${role === 'investor' ? 'bg-blue-50 hover:bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400 cursor-default'} px-4 py-2 rounded-full transition-colors duration-200`}
                disabled={role !== 'investor'}
              >
                <ThumbsUp size={18} className="mr-2" />
                <span className="font-medium">{qa.likeCount || 0}</span>
              </button>
            </div>
          </div>
        )}

        {role === 'corporate' && (
          <div className="flex justify-end space-x-2 px-4 py-3 bg-white">
            <button 
              onClick={handleClose} 
              className="py-1 px-3 border rounded hover:bg-gray-100"
              disabled={isSaving}
            >
              キャンセル
            </button>
            <button 
              onClick={handleDelete} 
              className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={isSaving}
            >
              削除
            </button>
            <button 
              onClick={handleSave} 
              className={`py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSaving}
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default QaDetailModal;
