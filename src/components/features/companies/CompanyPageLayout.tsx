// src/components/features/companies/CompanyPageLayout.tsx
import React from "react";
import { CompanyDetailResponse } from "@/types/api";
import CompanyHeader from "./CompanyHeader";
import TabSwitcher from "./TabSwitcher";
import ChatView from "./ChatView/ChatView";
import QAListView from "./QAListView/QAListView";

type CompanyPageLayoutProps = {
  companyDetail: CompanyDetailResponse;
  activeTab: "chat" | "qa";
  onTabChange: (tab: "chat" | "qa") => void;
};

const CompanyPageLayout: React.FC<CompanyPageLayoutProps> = ({
  companyDetail,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* ヘッダー領域 */}
      <CompanyHeader companyDetail={companyDetail} />

      {/* タブ切り替え */}
      <TabSwitcher
        tabs={[
          { key: "chat", label: "チャット" },
          { key: "qa", label: "QA一覧" },
        ]}
        activeTab={activeTab}
        onChangeTab={onTabChange}
      />

      {/* タブに応じて表示を切り替える */}
      <div className="mt-4">
        {activeTab === "chat" && (
          <ChatView companyId={companyDetail.id} />
        )}
        {activeTab === "qa" && (
          <QAListView companyId={companyDetail.id} />
        )}
      </div>
    </div>
  );
};

export default CompanyPageLayout;
