"use client";

import React, { useEffect, useState } from "react";
import { QADetailModalProps } from "@/types/components";
import { fetchQAList } from "@/libs/api"; // 例: 単発取得APIがあれば使う

export default function QADetailModal({
  isOpen,
  qaId,
  onClose,
}: QADetailModalProps) {
  const [qaDetail, setQADetail] = useState<any>(null);

  useEffect(() => {
    if (isOpen && qaId) {
      // ここで単体のQAを取得するAPIがあれば呼ぶ
      // 今は仮に fetchQAList( { qaId } ) などでデータを取得する例
      fetchQAList({}).then((res) => {
        // デモ: 単純に1件抽出
        const found = res.data.find((item) => item.id === qaId);
        setQADetail(found);
      });
    }
  }, [isOpen, qaId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-lg p-4 rounded shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          ×
        </button>
        <h2 className="text-lg font-semibold mb-2">QA詳細</h2>

        {!qaDetail && <div>Loading details...</div>}
        {qaDetail && (
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-800">{qaDetail.question}</p>
            <p className="text-sm text-gray-700">{qaDetail.answer}</p>
            <div className="text-xs text-gray-500">
              いいね: {qaDetail.likeCount} / ブックマーク: {qaDetail.bookmarkCount}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
