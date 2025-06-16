"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, CompanyInput } from "../../../lib/companySchema";
import { INDUSTRY_OPTIONS } from "../../../types/industry";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function CompanyCreatePage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
  });
  const [flash, setFlash] = useState<string | null>(null);
  const [businessDescriptionCount, setBusinessDescriptionCount] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [formData, setFormData] = useState<CompanyInput | null>(null);

  async function onSubmit(data: CompanyInput) {
    if (!showConfirmation) {
      // 確認画面を表示
      setFormData(data);
      setShowConfirmation(true);
      return;
    }

    // 実際の登録処理
    setFlash(null);
    console.log('送信データ:', data); // デバッグ用
    
    try {
      // データを適切な型に変換
      const submitData = {
        ...data,
        // employeeCountは数値として送信
        employeeCount: data.employeeCount ? Number(data.employeeCount) : null,
        // その他のフィールドはそのまま送信（capitalは文字列のまま）
      };
      
      console.log('変換後データ:', submitData); // デバッグ用
      
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(submitData),
      });
      
      console.log('レスポンスステータス:', res.status); // デバッグ用
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const result = await res.json();
      console.log('登録結果:', result); // デバッグ用
      
      setFlash("✅ 登録が完了しました");
      reset(); // フォームをクリア
      setShowConfirmation(false); // 確認画面を閉じる
      setFormData(null);
    } catch (err: any) {
      console.error('登録エラー:', err); // デバッグ用
      setFlash(`❌ ${err.message}`);
    }
  }

  async function handleConfirmSubmit() {
    if (formData) {
      await onSubmit(formData);
    }
  }

  function handleBackToEdit() {
    setShowConfirmation(false);
    setFlash(null);
  }

  // 確認画面の表示
  if (showConfirmation && formData) {
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
                  <p className="text-lg text-gray-800">{INDUSTRY_OPTIONS.find(option => option.value === formData.industry)?.label || '未選択'}</p>
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

                {formData.logoUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">ロゴURL</label>
                    <p className="text-gray-800">{formData.logoUrl}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4 pt-6">
                <button
                  onClick={handleBackToEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded transition-colors duration-200"
                >
                  編集
                </button>
                <button
                  onClick={handleConfirmSubmit}
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
                onClick={() => router.push('/admin')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                戻る
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* --- 必須 --- */}
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

              {/* --- 任意フィールド --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  証券コード
                </label>
                <input 
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  {...register("securitiesCode")} 
                />
                {errors.securitiesCode && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.securitiesCode.message}
                  </p>
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
                    onChange={(e) => {
                      setBusinessDescriptionCount(e.target.value.length);
                    }}
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
                  <p className="text-red-600 text-sm mt-1">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ロゴ URL
                </label>
                <input 
                  className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  {...register("logoUrl")} 
                />
                {errors.logoUrl && (
                  <p className="text-red-600 text-sm mt-1">{errors.logoUrl.message}</p>
                )}
              </div>
            </div>

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
    </div>
  );
}

