// src/components/features/my-page/AccountDeletionModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/shadcn//dialog";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";

type AccountDeletionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string, reason?: string) => void;
  isProcessing?: boolean;
  errorMessage?: string; // 必要なら
};

const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  errorMessage,
}) => {
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(password, reason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>アカウント退会</DialogTitle>
          <DialogDescription>
            この操作は取り消せません。本当に削除しますか？
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {errorMessage && (
            <div className="bg-error text-error p-2 rounded">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              パスワード
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              退会理由 (任意)
            </label>
            <Input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "処理中..." : "退会する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDeletionModal;
