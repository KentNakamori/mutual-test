/**
 * @file QAList.tsx
 * @description QA一覧表示コンポーネント
 */

import React from "react";
import QACard from "./QACard";
import { QA } from "@/types/domain/qa";

type QAListProps = {
  /** 表示するQA配列 */
  qas: QA[];
  /** 読み込み中フラグ */
  isLoading?: boolean;
  /** エラー文字列 (別途ページ側で表示するケースが多いので省略可) */
  errorMessage?: string;
  /** QAをクリックしたときのハンドラ */
  onSelectQA?: (qa: QA) => void;
};

const QAList: React.FC<QAListProps> = ({
  qas,
  isLoading = false,
  errorMessage,
  onSelectQA,
}) => {
  if (isLoading) {
    return (
      <div className="text-center text-gray-500 my-4">
        読み込み中です...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="text-center text-red-600 my-4">
        エラー: {errorMessage}
      </div>
    );
  }

  if (!qas || qas.length === 0) {
    return (
      <div className="text-center text-gray-500 my-4">
        該当するQAがありません。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {qas.map((qa) => (
        <QACard
          key={qa.id}
          qaItem={qa}
          onSelect={() => onSelectQA?.(qa)}
        />
      ))}
    </div>
  );
};

export default QAList;
