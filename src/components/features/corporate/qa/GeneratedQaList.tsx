// src/components/features/corporate/qa/GeneratedQaList.tsx
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { GeneratedQaListProps} from '@/types';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';


const itemsPerPage = 1; // 1問ずつ表示

const GeneratedQaList: React.FC<GeneratedQaListProps> = ({ qaDrafts, onUpdateDraft, onDeleteDraft }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(qaDrafts.length / itemsPerPage);

  // 現在のページのアイテムを抽出
  const currentItems = qaDrafts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 全体の中での現在の質問番号
  const currentQuestionNumber = (currentPage - 1) * itemsPerPage + 1;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">生成されたQ&A候補</h3>
      {qaDrafts.length === 0 ? (
        <p>候補がありません。</p>
      ) : (
        <>
          {/* 現在表示している質問の全体中の番号表示 */}
          <p className="text-sm text-gray-600 mb-2">
             {currentQuestionNumber} / {qaDrafts.length} 個目の質問
          </p>
          {currentItems.map((qa, index) => (
            <div key={qa.qaId} className="border p-4 rounded mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">質問文</label>
                <Input
                  value={qa.question}
                  onChange={(value) => onUpdateDraft((currentPage - 1) * itemsPerPage + index, { ...qa, question: value })}
                  placeholder="質問文を入力"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">回答文</label>
                <Textarea
                  value={qa.answer}
                  onChange={(value) => onUpdateDraft((currentPage - 1) * itemsPerPage + index, { ...qa, answer: value })}
                  placeholder="回答文を入力"
                />
              </div>
              <div className="flex justify-end">
                <Button label="削除" onClick={() => onDeleteDraft((currentPage - 1) * itemsPerPage + index)} variant="destructive" />
              </div>
            </div>
          ))}
          {/* ページネーション */}
          <div className="mt-4 flex justify-center items-center space-x-4">
            <Button
              label="前へ"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
            />
            <span className="text-sm">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              label="次へ"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GeneratedQaList;
