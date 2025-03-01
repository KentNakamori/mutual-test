"use client";
import React from "react";
import Layout from "@/components/common/Layout";
import TopPageMainContent from "@/components/features/top-page/TopPageMainContent";

const TopPage: React.FC = () => {
  return (
    <Layout userType="guest" showSidebar={true} showFooter={true}>
      <TopPageMainContent />
    </Layout>
  );
};

export default TopPage;
