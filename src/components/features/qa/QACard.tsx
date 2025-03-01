/**
 * @file QACard.tsx
 * @description 単一のQAをカード表示するコンポーネント
 */

import React from "react";
import Card from "@/components/ui/Card"; // shadcnラップCardを想定
import LikeButton from "@/components/ui/LikeButton";
import BookmarkButton from "@/components/ui/BookmarkButton";
import { QA } from "@/types/domain/qa";

type QACardProps = {
  qaItem: QA;
  /** カードをクリックしたとき */
  onSelect?: () => void;
  /** いいね操作(カード上で完結させるなら) */
  onLike?: () => void;
  /** ブックマーク操作(カード上で完結させるなら) */
  onBookmark?: () => void;
};

const QACard: React.FC<QACardProps> = ({
  qaItem,
  onSelect,
  onLike,
  onBookmark,
}) => {
  // 質問・回答が長い場合は一部だけ表示する例（任意）
  const answerSnippet = qaItem.answer.length > 60
    ? qaItem.answer.slice(0, 60) + "..."
    : qaItem.answer;

  return (
    <Card
      title={qaItem.question}
      description={`企業ID: ${qaItem.companyId}`}
      onClick={onSelect}
    >
      <div className="text-sm text-gray-700">
        {answerSnippet}
      </div>

      {/* ボタン類はCardのfooter等でもOK */}
      <div className="mt-2 flex items-center space-x-4">
        <LikeButton
          count={qaItem.likeCount}
          isLiked={false /* 要件に応じて制御 */}
          onToggleLike={onLike ? onLike : () => {}}
        />
        <BookmarkButton
          isBookmarked={false /* 要件に応じて制御 */}
          onToggleBookmark={onBookmark ? onBookmark : () => {}}
          label="ブックマーク"
        />
      </div>
    </Card>
  );
};

export default QACard;
