// src/components/features/companies/QAListView/QACard.tsx
import React from "react";
import { QA } from "@/types/domain/qa";

type QACardProps = {
  qa: QA;
  onClick?: () => void;
};

const QACard: React.FC<QACardProps> = ({ qa, onClick }) => {
  return (
    <div
      className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <h3 className="text-base font-medium mb-1">
        {qa.question}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2 overflow-hidden">
        {qa.answer}
      </p>
      <div className="text-xs text-gray-400 mt-1">
        いいね: {qa.likeCount} / ブックマーク: {qa.bookmarkCount}
      </div>
    </div>
  );
};

export default QACard;
