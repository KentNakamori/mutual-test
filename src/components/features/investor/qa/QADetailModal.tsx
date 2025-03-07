// src/components/features/investor/qa/QADetailModal.tsx
import React from 'react';
import Dialog from '../../../ui/Dialog';
import Button from '../../../ui/Button';
import { QA } from '../../../../types';

export interface QADetailModalProps {
  /** 表示対象のQAデータ。nullの場合は非表示とみなす。 */
  qa: QA;
  /** モーダルを閉じるためのコールバック */
  onClose: () => void;
  /** いいね操作ハンドラ */
  onLike: (qaId: string) => void;
  /** ブックマーク操作ハンドラ */
  onBookmark: (qaId: string) => void;
}

/**
 * QADetailModal コンポーネント
 * － 選択されたQAの詳細（質問全文、回答全文など）をモーダルで表示する。
 */
const QADetailModal: React.FC<QADetailModalProps> = ({ qa, onClose, onLike, onBookmark }) => {
  return (
    <Dialog isOpen={true} onClose={onClose} title="Q&A Detail">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">{qa.question}</h2>
        <p className="text-base text-gray-700">{qa.answer}</p>
        <p className="text-sm text-gray-500 mt-2">Company ID: {qa.companyId}</p>
      </div>
      <div className="flex justify-end space-x-4">
        <Button label="Like" onClick={() => onLike(qa.qaId)} variant="primary" />
        <Button label="Bookmark" onClick={() => onBookmark(qa.qaId)} variant="outline" />
        <Button label="Close" onClick={onClose} variant="destructive" />
      </div>
    </Dialog>
  );
};

export default QADetailModal;
