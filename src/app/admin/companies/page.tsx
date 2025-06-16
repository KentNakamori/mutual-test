"use client";

import React from "react";
import { useCompanyRegistration } from "@/components/features/admin/useCompanyRegistration";
import { CompanyFormFields } from "@/components/features/admin/CompanyFormFields";
import { CompanyConfirmation } from "@/components/features/admin/CompanyConfirmation";
import { LogoUploadModal } from "@/components/ui/LogoUploadModal";

export default function CompanyCreatePage() {
  const {
    form,
    flash,
    businessDescriptionCount,
    showConfirmation,
    formData,
    showLogoModal,
    setShowLogoModal,
    logoFile,
    logoPreview,
    handleLogoFileSelect,
    submitCompany,
    handleConfirmSubmit,
    handleBackToEdit,
    navigateBack,
  } = useCompanyRegistration();

  const { handleSubmit, formState: { isSubmitting } } = form;

  // 確認画面の表示
  if (showConfirmation && formData) {
    return (
      <CompanyConfirmation
        formData={formData}
        logoPreview={logoPreview}
        logoFile={logoFile}
        isSubmitting={isSubmitting}
        flash={flash}
        onBackToEdit={handleBackToEdit}
        onConfirmSubmit={handleConfirmSubmit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                新規企業登録
              </h1>
              <p className="text-gray-600">
                企業情報を入力してください
              </p>
            </div>
            <div>
              <button
                onClick={navigateBack}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                戻る
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(submitCompany)} className="space-y-6">
            <CompanyFormFields
              form={form}
              businessDescriptionCount={businessDescriptionCount}
              logoPreview={logoPreview}
              logoFile={logoFile}
              onLogoModalOpen={() => setShowLogoModal(true)}
            />

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white px-8 py-3 rounded transition-colors duration-200 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "確認中…" : "入力内容確認へ"}
              </button>
            </div>
          </form>

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

      {/* ロゴ選択モーダル */}
      <LogoUploadModal
        isOpen={showLogoModal}
        onClose={() => setShowLogoModal(false)}
        onFileSelect={handleLogoFileSelect}
      />
    </div>
  );
}

