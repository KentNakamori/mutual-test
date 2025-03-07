//src/components/features/investor/qa/QAResultItem.tsx
"use client";

import React from 'react';
import Button from '@/components/ui/Button';
import { QA } from '@/types';

export interface QAResultItemProps {
  /** 表示対象のQ&Aデータ */
  qa: QA;
  /** 項目クリック時のハンドラ */
  onClickItem: () => void;
  /** いいね操作ハンドラ */
  onLike: (qaId: string) => void;
  /** ブックマーク操作ハンドラ */
  onBookmark: (qaId: string) => void;
}

/**
 * QAResultItem コンポーネント
 * ・Q&A の質問と回答の抜粋、いいね数を表示し、各種操作ボタンを提供します。
 */
const QAResultItem: React.FC<QAResultItemProps> = ({ qa, onClickItem, onLike, onBookmark }) => {
  // 質問・回答の抜粋（50文字以内）
  const questionSnippet = qa.question.length > 50 ? qa.question.substring(0, 50) + '…' : qa.question;
  const answerSnippet = qa.answer.length > 50 ? qa.answer.substring(0, 50) + '…' : qa.answer;
  
  return (
    <div 
      className="p-4 border rounded hover:shadow-md cursor-pointer"
      onClick={onClickItem}
    >
      <h3 className="text-lg font-semibold mb-2">{questionSnippet}</h3>
      <p className="text-sm text-gray-600 mb-2">{answerSnippet}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm">いいね: {qa.likeCount}</span>
        <div className="flex space-x-2">
          <Button 
            label="いいね" 
            onClick={(e) => { e.stopPropagation(); onLike(qa.qaId); }} 
            variant="primary" 
          />
          <Button 
            label="ブックマーク" 
            onClick={(e) => { e.stopPropagation(); onBookmark(qa.qaId); }} 
            variant="outline" 
          />
        </div>
      </div>
    </div>
  );
};

export default QAResultItem;
