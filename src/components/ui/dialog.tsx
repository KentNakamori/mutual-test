/**
 * Dialogコンポーネント
 * - shadcnのDialogをラップ。シンプルなタイトル+本文+閉じるボタンを内包
 */
import React from "react";
import {
  Dialog as ShadcnDialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/shadcn/dialog";

import { Button } from "@/components/ui/Button";

export type CustomDialogProps = {
  /** ダイアログを開くかどうか */
  isOpen: boolean;
  /** ダイアログを閉じる処理 */
  onClose: () => void;
  /** タイトル */
  title?: string;
  /** 本文 or メインコンテンツ */
  children?: React.ReactNode;
  /** フッターボタン(OK/Cancelなど)をカスタマイズする場合は自前で挿入 */
  footerContent?: React.ReactNode;
};

const Dialog: React.FC<CustomDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
}) => {
  // shadcnのDialogは受け渡しが "open"と"onOpenChange" の場合が多い
  // ただ、設計の都合上 isOpen, onClose をPropsにし、Dialog自体を制御する形式に調整
  return (
    <ShadcnDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Triggerは外部から任意に置く(ここでは省略) */}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogDescription>
            {/* 説明文などをタイトル下に表示 */}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {children}
        </div>

        <DialogFooter>
          {footerContent ? (
            footerContent
          ) : (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </ShadcnDialog>
  );
};

export default Dialog;
