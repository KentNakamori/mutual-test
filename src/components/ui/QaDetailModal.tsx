import React, { useState, useEffect } from 'react';
import Dialog from '@/components/ui/Dialog';
import { QADetailModalProps, QA, TagOption } from '@/types';
import {
  INFO_SOURCE_OPTIONS,
  GENRE_OPTIONS,
  getTagColor,
} from '@/components/ui/tagConfig';
import { Calendar, ThumbsUp, X, BookOpen, Plus } from 'lucide-react';

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
  const [editableQA, setEditableQA] = useState<QA>({ ...qa });
  const [showSourceList, setShowSourceList] = useState(false);
  const [showGenreList, setShowGenreList] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditableQA({ ...qa });
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

  const handleCancel = () => {
    setEditableQA({ ...qa });
    onCancelEdit && onCancelEdit();
    onClose();
  };

  const handleSave = () => {
    const updatedQa: QA = {
      ...editableQA,
      updatedAt: new Date().toISOString(),
    };
    onSaveEdit && onSaveEdit(updatedQa);
    onClose();
  };

 // 削除用ハンドラ（確認用ポップアップ追加）
const handleDelete = () => {
  if (window.confirm("本当に削除しますか？")) {
    onDelete && onDelete(qa.qaId);
    onClose();
  }
};

  const handleLike = () => {
    onLike && onLike(qa.qaId);
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableQA({ ...editableQA, title: e.target.value });
  };
  const handleChangeQuestion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableQA({ ...editableQA, question: e.target.value });
  };
  const handleChangeAnswer = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableQA({ ...editableQA, answer: e.target.value });
  };
  const handleChangeFiscalPeriod = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableQA({ ...editableQA, fiscalPeriod: e.target.value });
  };
  // ステータスについては、参考UIでは 'draft' / 'pending' / 'published' を使用しますが、
  // ここでは isPublished (boolean) を基に、published: true, draft: false として実装
  const handleToggleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditableQA({ ...editableQA, isPublished: value === 'published' });
  };

  // タグ操作（情報ソース）
  const handleAddSource = (option: TagOption) => {
    if (!editableQA.tags.includes(option.label)) {
      setEditableQA({ 
        ...editableQA, 
        tags: [...editableQA.tags, option.label],
      });
    }
  };
  const handleRemoveSource = (label: string) => {
    setEditableQA({ 
      ...editableQA,
      tags: editableQA.tags.filter((t) => t !== label),
    });
  };

  // タグ操作（ジャンル）
  const handleAddGenre = (option: TagOption) => {
    if (!editableQA.genre.includes(option.label)) {
      setEditableQA({
        ...editableQA,
        genre: [...editableQA.genre, option.label],
      });
    }
  };
  const handleRemoveGenre = (label: string) => {
    setEditableQA({
      ...editableQA,
      genre: editableQA.genre.filter((g) => g !== label),
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  const viewCount = 89;

  const modalTitle = role === 'investor' 
    ? `QA詳細 (${qa.companyId?.includes('comp') ? getCompanyName(qa.companyId) : qa.companyId})`
    : 'QA詳細';

  function getCompanyName(companyId: string): string {
    const companyMap: Record<string, string> = {
      comp1: 'テック・イノベーターズ株式会社',
      comp2: 'グリーンエナジー株式会社',
    };
    return companyMap[companyId] || companyId;
  }

  

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={modalTitle} className="max-w-4xl my-10">
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                  <select
                    name="status"
                    value={editableQA.isPublished ? 'published' : 'draft'}
                    onChange={handleToggleStatus}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">下書き</option>
                    <option value="pending">承認待ち</option>
                    <option value="published">公開</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">情報ソース</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editableQA.tags.map((tag) => (
                    <div key={tag} className={`inline-flex items-center ${getTagColor(tag)} px-2 py-1 rounded-md text-xs`}>
                      <BookOpen size={12} className="mr-1" />
                      {tag}
                      <button
                        onClick={() => handleRemoveSource(tag)}
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
                      {INFO_SOURCE_OPTIONS.filter(option => !editableQA.tags.includes(option.label))
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
          // 投資家向けUI（変更なし）
          <div className="p-5">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{qa.title}</h2>
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Calendar size={16} className="mr-1" />
              <span className="mr-3">{formatDate(qa.createdAt)}</span>
              <span className="mx-2">•</span>
              <span className="mr-3">{qa.fiscalPeriod}</span>
              <span className="mx-2"></span>
            </div>
            <div className="mb-6">
              <div className="flex items-start">
                <div className="bg-blue-50 text-blue-600 p-1 rounded mr-2">
                  <span className="font-medium">質問</span>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{qa.question}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="font-medium text-gray-800 mb-3">回答</h3>
              <div className="text-gray-700 whitespace-pre-line">{qa.answer}</div>
            </div>
            <div className="flex flex-col space-y-3 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">情報ソース</h4>
                <div className="flex flex-wrap gap-2">
                  {qa.tags && qa.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">ジャンル</h4>
                <div className="flex flex-wrap gap-2">
                  {qa.genre && qa.genre.map((genre) => (
                    <span
                      key={genre}
                      className="inline-flex items-center bg-amber-100 text-amber-800 border border-pink-200 px-2 py-1 rounded-md text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleLike}
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <ThumbsUp size={20} className="mr-1" />
                <span>{qa.likeCount || 0}</span>
              </button>
            </div>
          </div>
        )}

        {role === 'corporate' && (
          <div className="flex justify-end space-x-2 px-4 py-3">
            <button onClick={handleCancel} className="py-1 px-3 border rounded">
              キャンセル
            </button>
            <button onClick={handleDelete} className="py-1 px-3 bg-red-500 text-white rounded">
              削除
            </button>
            <button onClick={handleSave} className="py-1 px-3 bg-blue-600 text-white rounded">
              保存
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default QaDetailModal;
