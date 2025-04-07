// components/ui/QACard.tsx
import React, { useState } from 'react';
import { QA, QACardProps } from '@/types';
import Card from '@/components/ui/Card';

// QACard 用のモード・ロール型（企業向けは "corporate"、投資家向けは "investor"）
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
  // プレビュー状態
  if (mode === 'preview') {
    return (
      <Card onClick={() => onSelect && onSelect(qa.qaId)}>
        <h4 className="text-lg font-semibold">{qa.title}</h4>
        <p className="text-sm">
          {qa.answer.substring(0, 100)}
          {qa.answer.length > 100 ? '…' : ''}
        </p>
        <div className="mt-2 text-xs text-gray-500">
          {/* 1行目 */}
          <div className="flex space-x-4">
            <span>決算年度: {qa.fiscalPeriod}</span>
            <span>公開日: {qa.createdAt}</span>
            <span>いいね: {qa.likeCount}</span>
          </div>
          {/* 2行目 */}
          <div className="flex space-x-4 mt-1">
            {qa.tags && qa.tags.length > 0 && (
              <span>タグ: {qa.tags.join(', ')}</span>
            )}
            {qa.genre && qa.genre.length > 0 && (
              <span>ジャンル: {qa.genre.join(', ')}</span>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // 詳細状態
  if (mode === 'detail') {
    return (
      <Card>
        <h4 className="text-lg font-semibold">{qa.title}</h4>
        <div className="mt-2">
          <strong>質問:</strong>
          <p>{qa.question}</p>
        </div>
        <div className="mt-2">
          <strong>回答:</strong>
          <p>{qa.answer}</p>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <div>決算年度: {qa.fiscalPeriod}</div>
          {qa.tags && qa.tags.length > 0 && <div>タグ: {qa.tags.join(', ')}</div>}
          {qa.genre && qa.genre.length > 0 && <div>ジャンル: {qa.genre.join(', ')}</div>}
          <div>公開日: {qa.createdAt}</div>
          <div>更新日: {qa.updatedAt}</div>
          <div>いいね: {qa.likeCount}</div>
          <div>公開状態: {qa.isPublished ? '公開' : '非公開'}</div>
          <div>企業ID: {qa.companyId}</div>
        </div>
        <div className="mt-4">
          {role === 'investor' && onLike && (
            <button
              onClick={() => onLike(qa.qaId)}
              className="mr-2 bg-black text-white py-1 px-3 rounded"
            >
              いいね
            </button>
          )}
          {role === 'corporate' && (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(qa.qaId)}
                  className="mr-2 bg-blue-500 text-white py-1 px-3 rounded"
                >
                  編集
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(qa.qaId)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  削除
                </button>
              )}
            </>
          )}
        </div>
      </Card>
    );
  }

  // 編集状態（企業向けのみ想定）
  if (mode === 'edit') {
    const [editedQA, setEditedQA] = useState<QA>({ ...qa });
    return (
      <Card>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">タイトル</label>
          <input
            type="text"
            value={editedQA.title}
            onChange={(e) => setEditedQA({ ...editedQA, title: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">質問</label>
          <textarea
            value={editedQA.question}
            onChange={(e) => setEditedQA({ ...editedQA, question: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">回答</label>
          <textarea
            value={editedQA.answer}
            onChange={(e) => setEditedQA({ ...editedQA, answer: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">決算年度</label>
          <input
            type="text"
            value={editedQA.fiscalPeriod}
            onChange={(e) => setEditedQA({ ...editedQA, fiscalPeriod: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">タグ (カンマ区切り)</label>
          <input
            type="text"
            value={editedQA.tags.join(', ')}
            onChange={(e) =>
              setEditedQA({
                ...editedQA,
                tags: e.target.value.split(',').map(tag => tag.trim()),
              })
            }
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">ジャンル (カンマ区切り)</label>
          <input
            type="text"
            value={editedQA.genre.join(', ')}
            onChange={(e) =>
              setEditedQA({
                ...editedQA,
                genre: e.target.value.split(',').map(g => g.trim()),
              })
            }
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancelEdit} className="py-1 px-3 border rounded">
            キャンセル
          </button>
          <button
            onClick={() =>
              onSaveEdit && onSaveEdit({ ...editedQA, updatedAt: new Date().toISOString() })
            }
            className="py-1 px-3 bg-black text-white rounded"
          >
            保存
          </button>
        </div>
      </Card>
    );
  }

  return null;
};

export default QACard;
