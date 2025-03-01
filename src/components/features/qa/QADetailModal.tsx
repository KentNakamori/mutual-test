/**
 * @file QADetailModal.tsx
 * @description 単一QAの詳細をモーダルで表示するコンポーネント
 */

import React from "react";
import Dialog from "@/components/ui/Dialog"; // shadcnラップDialog
import { Button } from "@/components/ui/Button";
import LikeButton from "@/components/ui/LikeButton";
import BookmarkButton from "@/components/ui/BookmarkButton";
import { QA } from "@/types/domain/qa";

type QADetailModalProps = {
  /** モーダル開閉フラグ */
  isOpen: boolean;
  /** 表示するQAデータ */
  qa: QA | null;
  /** 閉じる時のハンドラ */
  onClose: () => void;
  /** いいね操作 */
  onLikeToggle?: (qaId: string) => void;
  /** ブックマーク操作 */
  onBookmarkToggle?: (qaId: string) => void;
};

const QADetailModal: React.FC<QADetailModalProps> = ({
  isOpen,
  qa,
  onClose,
  onLikeToggle,
  onBookmarkToggle,
}) => {
  if (!qa) {
    return null; // QAがnullのときは何も表示しない
  }

  const handleLike = () => {
    if (onLikeToggle) {
      onLikeToggle(qa.id);
    }
  };

  const handleBookmark = () => {
    if (onBookmarkToggle) {
      onBookmarkToggle(qa.id);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="QA詳細"
      footerContent={
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
        </div>
      }
    >
      <div className="text-sm text-gray-700 space-y-3">
        <div>
          <span className="font-semibold">企業ID:</span> {qa.companyId}
        </div>
        <div>
          <span className="font-semibold">質問:</span> {qa.question}
        </div>
        <div>
          <span className="font-semibold">回答:</span> {qa.answer}
        </div>
        <div>
          <span className="font-semibold">いいね数:</span> {qa.likeCount} /{" "}
          <span className="font-semibold">ブックマーク数:</span>{" "}
          {qa.bookmarkCount}
        </div>

        {/* いいね/ブックマークボタン */}
        <div className="flex space-x-3">
          <LikeButton
            count={qa.likeCount}
            isLiked={false} // 実際はユーザーがいいね済みかどうかのフラグを受け取る
            onToggleLike={handleLike}
          />
          <BookmarkButton
            isBookmarked={false}
            onToggleBookmark={handleBookmark}
            label="ブックマーク"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default QADetailModal;
