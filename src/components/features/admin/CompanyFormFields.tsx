"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CompanyInput } from "../../../lib/companySchema";
import { INDUSTRY_OPTIONS } from "../../../types/industry";

interface CompanyFormFieldsProps {
  form: UseFormReturn<CompanyInput>;
  businessDescriptionCount: number;
  logoPreview: string;
  logoFile: File | null;
  onLogoModalOpen: () => void;
}

export const CompanyFormFields: React.FC<CompanyFormFieldsProps> = ({
  form,
  businessDescriptionCount,
  logoPreview,
  logoFile,
  onLogoModalOpen,
}) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 必須フィールド */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          会社名 *
        </label>
        <input 
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          {...register("companyName")} 
        />
        {errors.companyName && (
          <p className="text-red-600 text-sm mt-1">{errors.companyName.message}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          業種 *
        </label>
        <select 
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          {...register("industry")} 
        >
          <option value="">業種を選択してください</option>
          {INDUSTRY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p className="text-red-600 text-sm mt-1">{errors.industry.message}</p>
        )}
      </div>

      {/* 任意フィールド */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          証券コード
        </label>
        <input 
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          {...register("securitiesCode")} 
        />
        {errors.securitiesCode && (
          <p className="text-red-600 text-sm mt-1">{errors.securitiesCode.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          市場区分
        </label>
        <select 
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          {...register("marketSegment")} 
        >
          <option value="">選択してください</option>
          <option value="東証プライム">東証プライム</option>
          <option value="東証スタンダード">東証スタンダード</option>
          <option value="東証グロース">東証グロース</option>
          <option value="未上場">未上場</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          設立日（年月）
        </label>
        <input
          type="month"
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          {...register("establishedDate")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          代表者
        </label>
        <input 
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          {...register("ceo")} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          電話番号
        </label>
        <input 
          type="tel"
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          {...register("phone")} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          従業員数
        </label>
        <input
          type="number"
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          {...register("employeeCount")}
        />
        {errors.employeeCount && (
          <p className="text-red-600 text-sm mt-1">{errors.employeeCount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          資本金
        </label>
        <input
          type="text"
          placeholder="例: 10億円"
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          {...register("capital")}
        />
        {errors.capital && (
          <p className="text-red-600 text-sm mt-1">{errors.capital.message}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          住所
        </label>
        <input 
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          {...register("address")} 
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          事業内容（30文字以内推奨）
        </label>
        <div className="relative">
          <textarea
            rows={2}
            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            {...register("businessDescription")}
          />
          <div className="absolute bottom-2 right-2 text-sm text-gray-500 bg-white px-1">
            {businessDescriptionCount}文字
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Web サイト
        </label>
        <input 
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          {...register("websiteUrl")} 
        />
        {errors.websiteUrl && (
          <p className="text-red-600 text-sm mt-1">{errors.websiteUrl.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          問い合わせメール
        </label>
        <input 
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          {...register("contactEmail")} 
        />
        {errors.contactEmail && (
          <p className="text-red-600 text-sm mt-1">{errors.contactEmail.message}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ロゴ
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {logoPreview ? (
              <div className="w-24 h-16 flex items-center justify-center bg-gray-50 rounded border overflow-hidden">
                <img 
                  src={logoPreview} 
                  alt="Company Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Logo</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <button
              type="button"
              onClick={onLogoModalOpen}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              ロゴを選択
            </button>
            <p className="text-sm text-gray-500 mt-1">
              5MB以下の画像ファイル（PNG, JPEG, JPG, GIF, SVG, WEBP）
            </p>
            {logoFile && (
              <p className="text-sm text-green-600 mt-1">
                選択済み: {logoFile.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 