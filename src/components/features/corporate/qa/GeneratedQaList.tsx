// src/components/features/corporate/qa/GeneratedQaList.tsx
import React from 'react';
import Button from '@/components/ui/Button';
import { QA } from '@/types';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

export interface GeneratedQaListProps {
  qaDrafts: QA[];
  onUpdateDraft: (index: number, updatedQa: QA) => void;
  onDeleteDraft: (index: number) => void;
}

const GeneratedQaList: React.FC<GeneratedQaListProps> = ({ qaDrafts, onUpdateDraft, onDeleteDraft }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">生成されたQ&A候補</h3>
      {qaDrafts.length === 0 ? (
        <p>候補がありません。</p>
      ) : (
        qaDrafts.map((qa, index) => (
          <div key={qa.qaId} className="border p-4 rounded mb-4">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">質問文</label>
              <Input
                value={qa.question}
                onChange={(value) => onUpdateDraft(index, { ...qa, question: value })}
                placeholder="質問文を入力"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">回答文</label>
              <Textarea
                value={qa.answer}
                onChange={(value) => onUpdateDraft(index, { ...qa, answer: value })}
                placeholder="回答文を入力"
              />
            </div>
            <Button label="削除" onClick={() => onDeleteDraft(index)} variant="destructive" />
          </div>
        ))
      )}
    </div>
  );
};

export default GeneratedQaList;
