// src/components/features/companies/QAListView/QAList.tsx
import React from "react";
import { QA } from "@/types/domain/qa";
import QACard from "./QACard";

type QAListProps = {
  qas: QA[];
  onSelectQA: (qaId: string) => void;
  isLoading?: boolean;
};

const QAList: React.FC<QAListProps> = ({ qas, onSelectQA, isLoading }) => {
  if (isLoading) {
    return <div>Loading QA...</div>;
  }

  if (!qas.length) {
    return <div className="text-sm text-gray-500">QAがありません</div>;
  }

  return (
    <div className="space-y-2">
      {qas.map((qa) => (
        <QACard
          key={qa.id}
          qa={qa}
          onClick={() => onSelectQA(qa.id)}
        />
      ))}
    </div>
  );
};

export default QAList;
