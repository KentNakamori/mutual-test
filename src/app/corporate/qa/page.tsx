// src/app/corporate/qa/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// 共通コンポーネントのインポート
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import Footer from "@/components/common/Footer";

// Q&A ページ固有コンポーネントのインポート
import TopActionBar from "@/components/features/corporate/qa/TopActionBar";
import QaListTable from "@/components/features/corporate/qa/QaListTable";
import QaEditModal from "@/components/features/corporate/qa/QaEditModal";
import UploadModal from "@/components/features/corporate/qa/UploadModal";

// 型定義（QA型は既存のものを利用）
import { QA } from "@/types";

// モックデータ（バックエンド未接続時用）
const mockQas: QA[] = [
  {
    qaId: "1",
    question: "この製品はどのように動作しますか？",
    answer: "製品は最新のテクノロジーを活用して動作します。詳しい仕組みは…",
    companyId: "comp1",
    likeCount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: true,
  },
  {
    qaId: "2",
    question: "保証期間はどのくらいですか？",
    answer: "保証期間は1年間です。ご不明点があればお問い合わせください。",
    companyId: "comp1",
    likeCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: true,
  },
];

// サイドバーのメニュー定義（corporate/dashboard/page.tsx と同じ実装）
const sidebarMenuItems = [
  { label: "Dashboard", link: "/corporate/dashboard" },
  { label: "Q&A管理", link: "/corporate/qa" },
  { label: "IRチャット", link: "/corporate/irchat" },
];

const QaPage: React.FC = () => {
  const router = useRouter();

  // Q&A 一覧の状態管理
  const [qas, setQas] = useState<QA[]>(mockQas);
  const [selectedQa, setSelectedQa] = useState<QA | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // 検索フォームからのコールバック
  const handleSearch = (params: { query: string; theme?: string }) => {
    const filtered = mockQas.filter((qa) =>
      qa.question.toLowerCase().includes(params.query.toLowerCase())
    );
    setQas(filtered);
  };

  // 編集モーダルの制御
  const handleOpenEditModal = (qaId: string) => {
    const qa = qas.find((item) => item.qaId === qaId) || null;
    setSelectedQa(qa);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedQa(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = (updatedQa: QA) => {
    setQas((prev) => prev.map((q) => (q.qaId === updatedQa.qaId ? updatedQa : q)));
    handleCloseEditModal();
  };

  const handleDeleteQa = (qaId: string) => {
    setQas((prev) => prev.filter((q) => q.qaId !== qaId));
  };

  // アップロードモーダルの制御
  const handleOpenUploadModal = () => setIsUploadModalOpen(true);
  const handleCloseUploadModal = () => setIsUploadModalOpen(false);

  const handleConfirmUpload = (newQas: QA[]) => {
    setQas((prev) => [...newQas, ...prev]);
    handleCloseUploadModal();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <Header
        navigationLinks={[
          { label: "ホーム", href: "/" },
          { label: "Q&A", href: "/qa" },
          { label: "設定", href: "/settings" },
        ]}
        userStatus={{ isLoggedIn: true, userName: "ユーザー名" }}
        onClickLogo={() => router.push("/qa")}
      />
      {/* サイドバーとメインコンテンツの横並びレイアウト */}
      <div className="flex flex-1">
        {/* サイドバー */}
        <Sidebar
          menuItems={sidebarMenuItems}
          isCollapsible
          selectedItem="/qa"
          onSelectMenuItem={(link) => router.push(link)}
        />
        {/* メインコンテンツ */}
        <main className="flex-1 p-6 bg-gray-50">
          <TopActionBar onSearch={handleSearch} onUploadClick={handleOpenUploadModal} />
          <QaListTable qaItems={qas} onEdit={handleOpenEditModal} onDelete={handleDeleteQa} />
        </main>
      </div>
      {/* フッター */}
      <Footer
        footerLinks={[
          { label: "利用規約", href: "/terms" },
          { label: "プライバシーポリシー", href: "/privacy" },
        ]}
        copyrightText="MyApp Inc."
        onSelectLink={(href) => router.push(href)}
      />
      {/* 編集モーダル */}
      {isEditModalOpen && selectedQa && (
        <QaEditModal qaItem={selectedQa} onClose={handleCloseEditModal} onSave={handleSaveEdit} />
      )}
      {/* アップロードモーダル */}
      {isUploadModalOpen && (
        <UploadModal onClose={handleCloseUploadModal} onConfirm={handleConfirmUpload} />
      )}
    </div>
  );
};

export default QaPage;
