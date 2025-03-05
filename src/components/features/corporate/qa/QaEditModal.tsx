// src/components/features/qa/QaEditModal.tsx
import React, { useState, useEffect } from 'react';
import Dialog from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FileAttachmentSection from './FileAttachmentSection';
import Button from '@/components/ui/Button';
import { QA, FileReference } from '@/types';

export interface QaEditModalProps {
  qaItem: QA | null;
  onClose: () => void;
  onSave: (updatedQa: QA) => void;
}

const QaEditModal: React.FC<QaEditModalProps> = ({ qaItem, onClose, onSave }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<FileReference[]>([]);

  useEffect(() => {
    if (qaItem) {
      setQuestion(qaItem.question);
      setAnswer(qaItem.answer);
      // ※必要に応じて既存添付ファイルもセット
    }
  }, [qaItem]);

  const handleFileAdd = (file: File) => {
    // ファイルアップロードをシミュレートし FileReference を生成
    const newFile: FileReference = {
      fileId: Date.now().toString(),
      fileName: file.name,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    };
    setAttachedFiles(prev => [...prev, newFile]);
  };

  const handleFileRemove = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.fileId !== fileId));
  };

  const handleSaveClick = () => {
    if (qaItem) {
      const updatedQa: QA = {
        ...qaItem,
        question,
        answer,
        updatedAt: new Date().toISOString(),
      };
      onSave(updatedQa);
    }
  };

  return (
    <Dialog isOpen={true} onClose={onClose} title="Q&A 編集">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">質問文</label>
          <Input value={question} onChange={setQuestion} placeholder="質問文を入力" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">回答文</label>
          <Textarea value={answer} onChange={setAnswer} placeholder="回答文を入力" />
        </div>
        <FileAttachmentSection
          attachedFiles={attachedFiles}
          onAddFile={handleFileAdd}
          onRemoveFile={handleFileRemove}
        />
        <div className="flex justify-end space-x-2">
          <Button label="キャンセル" onClick={onClose} variant="outline" />
          <Button label="保存" onClick={handleSaveClick} />
        </div>
      </div>
    </Dialog>
  );
};

export default QaEditModal;
