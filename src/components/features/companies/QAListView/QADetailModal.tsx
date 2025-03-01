// src/components/features/companies/QAListView/QADetailModal.tsx
import React from "react";
import { QA } from "@/types/domain/qa";
import { cn } from "@/libs/utils";

type QADetailModalProps = {
  isOpen: boolean;
  qa?: QA;
  onClose: () => void;
};

const QADetailModal: React.FC<QADetailModalProps> = ({
  isOpen,
  qa,
  onClose,
}) => {
  if (!isOpen || !qa) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50",
        "bg-gray-800 bg-opacity-50"
      )}
    >
      <div className="bg-white w-full max-w-lg p-4 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Q&A詳細</h2>
        <p className="text-sm text-gray-600 mb-2">
          <strong>質問:</strong> {qa.question}
        </p>
        <p className="text-sm text-gray-800 mb-2">
          <strong>回答:</strong> {qa.answer}
        </p>
        <div className="text-xs text-gray-500 mb-4">
          いいね: {qa.likeCount} / ブックマーク: {qa.bookmarkCount}
        </div>

        <div className="flex justify-end space-x-2">
          {/* いいね・ブックマークを押す実装は割愛してます */}
          <button
            className="px-4 py-2 bg-black text-white rounded"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default QADetailModal;
