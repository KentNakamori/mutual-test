// src/app/corporate/qa/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";
import TopActionBar from "@/components/features/corporate/qa/TopActionBar";
import QaListCards from "@/components/features/corporate/qa/QaListCards";
import UploadModal from "@/components/features/corporate/qa/UploadModal";
import QaDetailModal from "@/components/ui/QaDetailModal";
import { QA } from "@/types";
import { LayoutDashboard, HelpCircle, MessageSquare, Settings } from 'lucide-react';

// モックデータ（必要なプロパティを補完）
const mockQas: QA[] = [
  {
    qaId: "1",
    title: "この製品の動作について",
    question: "この製品はどのように動作しますか？",
    answer: "製品は最新のテクノロジーを活用して動作します。詳しい仕組みは…",
    companyId: "comp1",
    likeCount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: true,
    tags: [],
    genre: [],
    fiscalPeriod: "2025年度",
  },
  {
    qaId: "2",
    title: "保証期間について",
    question: "保証期間はどのくらいですか？",
    answer: "保証期間は1年間です。ご不明点があればお問い合わせください。",
    companyId: "comp1",
    likeCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: true,
    tags: [],
    genre: [],
    fiscalPeriod: "2025年度",
  },
];

const sidebarMenuItems = [
  { label: "ダッシュボード", link: "/corporate/dashboard", icon: <LayoutDashboard size={20} />},
  { label: "Q&A管理", link: "/corporate/qa", icon: <HelpCircle size={20} /> },
  { label: "IRチャット", link: "/corporate/irchat" , icon: <MessageSquare size={20} />},
  { label: "設定", link: "/corporate/settings", icon: <Settings size={20} />  },
];

const QaPage: React.FC = () => {
  const router = useRouter();
  const [qas, setQas] = useState<QA[]>(mockQas);
  const [selectedQa, setSelectedQa] = useState<QA | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleSearch = (params: { query: string; theme?: string }) => {
    const filtered = mockQas.filter((qa) =>
      qa.question.toLowerCase().includes(params.query.toLowerCase())
    );
    setQas(filtered);
  };

  // QAカードクリック時のハンドラ
  const handleSelectQA = (qaId: string) => {
    const qa = qas.find((item) => item.qaId === qaId) || null;
    setSelectedQa(qa);
  };

  const handleDeleteQa = (qaId: string) => {
    setQas((prev) => prev.filter((q) => q.qaId !== qaId));
  };

  const handleOpenUploadModal = () => setIsUploadModalOpen(true);
  const handleCloseUploadModal = () => setIsUploadModalOpen(false);
  const handleConfirmUpload = (newQas: QA[]) => {
    setQas((prev) => [...newQas, ...prev]);
    handleCloseUploadModal();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          menuItems={sidebarMenuItems}
          isCollapsible
          selectedItem="/corporate/qa"
          onSelectMenuItem={(link) => router.push(link)}
        />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">QA データベース・資料登録</h1>
          </div>
          <TopActionBar onSearch={handleSearch} onUploadClick={handleOpenUploadModal} />
          <QaListCards
            qaItems={qas}
            onSelect={handleSelectQA}
            onEdit={handleSelectQA}
            onDelete={handleDeleteQa}
          />
        </main>
      </div>
      <Footer
        footerLinks={[
          { label: "利用規約", href: "/terms" },
          { label: "プライバシーポリシー", href: "/privacy" },
        ]}
        copyrightText="MyApp Inc."
        onSelectLink={(href) => router.push(href)}
      />
      {/* QA詳細モーダル（role="corporate"で編集ボタン付き） */}
      {selectedQa && (
        <QaDetailModal
          qa={selectedQa}
          isOpen={true}
          role="corporate"
          onClose={() => setSelectedQa(null)}
          onLike={(id: string) => {
            console.log("いいね", id);
          }}
          onDelete={(id: string) => handleDeleteQa(id)}
          onSaveEdit={(updatedQa) => {
            setQas((prev) =>
              prev.map((q) => (q.qaId === updatedQa.qaId ? { ...q, ...updatedQa } : q))
            );
          }}
        />
      )}
      {isUploadModalOpen && (
        <UploadModal onClose={handleCloseUploadModal} onConfirm={handleConfirmUpload} />
      )}
    </div>
  );
};

export default QaPage;
