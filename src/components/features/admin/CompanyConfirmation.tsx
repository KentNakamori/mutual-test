"use client";

import React from "react";
import { CompanyInput } from "../../../lib/companySchema";
import { INDUSTRY_OPTIONS } from "../../../types/industry";

interface CompanyConfirmationProps {
  formData: CompanyInput;
  logoPreview: string;
  logoFile: File | null;
  isSubmitting: boolean;
  flash: string | null;
  onBackToEdit: () => void;
  onConfirmSubmit: () => void;
}

export const CompanyConfirmation: React.FC<CompanyConfirmationProps> = ({
  formData,
  logoPreview,
  logoFile,
  isSubmitting,
  flash,
  onBackToEdit,
  onConfirmSubmit,
}) => {
  const industryLabel = INDUSTRY_OPTIONS.find(option => option.value === formData.industry)?.label || '未選択';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                入力内容確認
              </h1>
              <p className="text-gray-600">
                以下の内容で企業を登録します
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">会社名</label>
                <p className="text-lg font-semibold text-gray-800">{formData.companyName || '未入力'}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">業種</label>
                <p className="text-lg text-gray-800">{industryLabel}</p>
              </div>

              {formData.securitiesCode && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">証券コード</label>
                  <p className="text-gray-800">{formData.securitiesCode}</p>
                </div>
              )}

              {formData.marketSegment && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">市場区分</label>
                  <p className="text-gray-800">{formData.marketSegment}</p>
                </div>
              )}

              {formData.establishedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">設立日</label>
                  <p className="text-gray-800">{formData.establishedDate}</p>
                </div>
              )}

              {formData.ceo && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">代表者</label>
                  <p className="text-gray-800">{formData.ceo}</p>
                </div>
              )}

              {formData.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">電話番号</label>
                  <p className="text-gray-800">{formData.phone}</p>
                </div>
              )}

              {formData.employeeCount && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">従業員数</label>
                  <p className="text-gray-800">{formData.employeeCount}人</p>
                </div>
              )}

              {formData.capital && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">資本金</label>
                  <p className="text-gray-800">{formData.capital}</p>
                </div>
              )}

              {formData.address && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">住所</label>
                  <p className="text-gray-800">{formData.address}</p>
                </div>
              )}

              {formData.businessDescription && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">事業内容</label>
                  <p className="text-gray-800">{formData.businessDescription}</p>
                </div>
              )}

              {formData.websiteUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Webサイト</label>
                  <p className="text-gray-800">{formData.websiteUrl}</p>
                </div>
              )}

              {formData.contactEmail && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">問い合わせメール</label>
                  <p className="text-gray-800">{formData.contactEmail}</p>
                </div>
              )}

              {logoPreview && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">ロゴ</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 flex items-center justify-center bg-gray-50 rounded border overflow-hidden">
                      <img 
                        src={logoPreview} 
                        alt="Company Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">ロゴが設定されています</p>
                      <p className="text-sm text-gray-500">{logoFile?.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button
                onClick={onBackToEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded transition-colors duration-200"
              >
                編集
              </button>
              <button
                onClick={onConfirmSubmit}
                disabled={isSubmitting}
                className="bg-black text-white px-8 py-3 rounded transition-colors duration-200 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "登録中…" : "企業登録"}
              </button>
            </div>
          </div>

          {flash && (
            <div className={`mt-6 p-4 rounded text-center ${
              flash.includes('✅') 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {flash}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 