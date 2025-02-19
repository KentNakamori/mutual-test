"use client";


import React from "react";
import { useToggleFollowCompany } from "@/hooks/useCompanies";

interface CompanyHeaderProps {
  companyName: string;
  logoUrl?: string;
  industry?: string;
  description?: string;
  isFollowing?: boolean;
  companyId: string;
}

export default function CompanyHeader({
  companyName,
  logoUrl,
  industry,
  description,
  isFollowing = false,
  companyId,
}: CompanyHeaderProps) {
  const { mutate: toggleFollow, isLoading } = useToggleFollowCompany();

  const handleToggleFollow = () => {
    if (isLoading) return;
    toggleFollow({ companyId });
  };

  return (
    <div className="bg-white border-b border-gray-100 p-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
      {/* ロゴ */}
      {logoUrl && (
        <div>
          <img
            src={logoUrl}
            alt={`${companyName} logo`}
            className="w-20 h-20 object-contain"
          />
        </div>
      )}

      {/* 企業情報 */}
      <div className="flex-1">
        <h1 className="text-2xl font-semibold leading-relaxed">{companyName}</h1>
        {industry && (
          <p className="text-sm text-gray-600 mb-1">{industry}</p>
        )}
        {description && (
          <p className="text-sm text-gray-700">{description}</p>
        )}
      </div>

      {/* フォローボタン (例) */}
      <div className="mt-2 md:mt-0">
        <button
          onClick={handleToggleFollow}
          disabled={isLoading}
          className={`px-4 py-2 text-sm rounded ${
            isFollowing ? "bg-gray-300 text-black" : "bg-black text-white"
          } transition-colors duration-200 disabled:opacity-50`}
        >
          {isFollowing ? "フォロー中" : "フォロー"}
        </button>
      </div>
    </div>
  );
}
