/**
 * @file page.tsx
 * @description 投資家向けQAの横断検索ページ (検索フォーム + QA一覧 + 詳細モーダル)
 */

"use client"; 
// → このページでReact Hooksや状態管理(クライアントコンポーネント)を使うために指定

import React from "react";
import { useState, useEffect } from "react";

// 既存の共通レイアウト（例: Layout, Header, Footerなど）があればインポート
// ここではダミーとして用意し、後述のページ固有コンポーネントを利用する想定
import Layout from "@/components/common/Layout";

// ページ固有コンポーネント
import InvestorQASearchForm from "@/components/features/qa/InvestorQASearchForm";
import QAList from "@/components/features/qa/QAList";
import QADetailModal from "@/components/features/qa/QADetailModal";

// カスタムフック (useQASearch) がある場合はインポート
// 今回はエラー・モックデータ対応を記述するため、
// 例として useQASearch はコメントアウトしています。
// import { useQASearch } from "@/hooks/useQA";

// 型定義 (QA) - domainで定義した型を拡張して companyName などを含めてもOK
import { QA } from "@/types/domain/qa";

/**
 * QASearchPage コンポーネント
 * - 横断検索フォーム
 * - 検索結果一覧
 * - 詳細モーダル
 * のUIをまとめたページ
 */
export default function InvestorQASearchPage() {
  // 検索条件の状態
  const [keyword, setKeyword] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  // 他にもソートや業種などのフィルタを必要に応じて追加

  // QA一覧 (検索結果)
  const [qaList, setQaList] = useState<QA[]>([]);
  // エラー制御用
  const [error, setError] = useState<string | null>(null);
  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);

  // 詳細表示用
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---- (1) 実際にAPIを呼ぶ場合は、React Queryや独自fetchロジックなどを利用 ----
  // ここではエラー時にモックデータで代替表示する例を示す。
  // const { data, isError, isLoading, refetch } = useQASearch({ keyword, company: selectedCompany });
  // ...

  // (2) モックデータ（バックエンドにつながらない場合用）
  //   - テストやUI確認のためのサンプルデータ
  const mockQAs: QA[] = [
    {
      id: "1",
      companyId: "company-123",
      question: "昨年度の売上高はどれくらいですか？",
      answer: "昨年度は1億円の売上がありました。",
      likeCount: 10,
      bookmarkCount: 2,
      isPublic: true,
      createdAt: "2025-01-01T09:00:00",
      updatedAt: "2025-01-01T09:00:00",
      // RecordStatus系
      isArchived: false,
      isDeleted: false,
    },
    {
      id: "2",
      companyId: "company-456",
      question: "株主優待はありますか？",
      answer: "現在検討中ですが、具体的な内容は未定です。",
      likeCount: 5,
      bookmarkCount: 1,
      isPublic: true,
      createdAt: "2025-02-10T12:00:00",
      updatedAt: "2025-02-10T12:00:00",
      isArchived: false,
      isDeleted: false,
    },
  ];

  // 検索実行ハンドラ
  const handleSearch = async (conditions: {
    keyword: string;
    company: string;
  }) => {
    setError(null);
    setIsLoading(true);

    try {
      // (A) 実際のAPI呼び出し (useQASearch などがあればそちらを活用)
      // const response = await refetch();
      // if (response.error) throw new Error(response.error.message);

      // (B) ここでは「擬似的にエラーを起こしてモックデータにフォールバック」する例
      const willFail = Math.random() < 0.4; // 40%くらいでAPI失敗させるデモ
      if (willFail) {
        throw new Error("API呼び出しに失敗しました (デモエラー)");
      }

      // 正常時の仮レスポンス
      // いったんモックデータを検索条件でフィルタする簡易実装にしておく
      const filtered = mockQAs.filter((qa) => {
        if (
          conditions.keyword &&
          !qa.question.includes(conditions.keyword) &&
          !qa.answer.includes(conditions.keyword)
        ) {
          return false;
        }
        if (conditions.company && qa.companyId !== conditions.company) {
          return false;
        }
        return true;
      });

      setQaList(filtered);
    } catch (err: any) {
      // エラーが発生したらモックデータを丸ごと表示 + エラーメッセージをセット
      setQaList(mockQAs);
      setError(err.message || "予期せぬエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  // コンポーネント初期表示時にモック検索しておく (optional)
  useEffect(() => {
    handleSearch({ keyword: "", company: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // QAクリック → 詳細モーダル開く
  const handleSelectQA = (qa: QA) => {
    setSelectedQA(qa);
    setIsModalOpen(true);
  };

  // モーダルクローズ
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQA(null);
  };

  // いいね/ブックマーク操作 (ここではモック実装)
  const handleLikeToggle = (qaId: string) => {
    // qaListの状態を更新
    setQaList((prev) =>
      prev.map((qa) =>
        qa.id === qaId ? { ...qa, likeCount: qa.likeCount + 1 } : qa
      )
    );
  };
  const handleBookmarkToggle = (qaId: string) => {
    setQaList((prev) =>
      prev.map((qa) =>
        qa.id === qaId ? { ...qa, bookmarkCount: qa.bookmarkCount + 1 } : qa
      )
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-4">投資家向けQA横断検索</h1>

        {/* 検索フォーム */}
        <InvestorQASearchForm
          onSearch={(conditions) => {
            setKeyword(conditions.keyword);
            setSelectedCompany(conditions.company);
            handleSearch(conditions);
          }}
          initialKeyword={keyword}
          initialCompany={selectedCompany}
        />

        {/* エラーメッセージ表示 */}
        {error && (
          <div className="bg-error text-error px-4 py-2 my-4 rounded">
            {error}
          </div>
        )}

        {/* QA一覧 */}
        <QAList
          qas={qaList}
          isLoading={isLoading}
          onSelectQA={handleSelectQA}
        />

        {/* 詳細モーダル */}
        <QADetailModal
          isOpen={isModalOpen}
          qa={selectedQA}
          onClose={handleCloseModal}
          onLikeToggle={handleLikeToggle}
          onBookmarkToggle={handleBookmarkToggle}
        />
      </div>
    </Layout>
  );
}
