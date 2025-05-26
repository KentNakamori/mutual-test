"use client";

import React, { useState, useEffect } from "react";
import { Company, CompanyId, CorporateUserRegistrationData} from "@/types";
import { Industry, INDUSTRY_OPTIONS } from '@/types/industry';

// 既存の Company 型を基に、登録時のデータとして不要なプロパティを除外
type CompanyRegistrationData = Omit<Company, "companyId" | "createdAt" | "updatedAt" | "adminUserIds">;



const AdminAccountCreationPage: React.FC = () => {
  const [companyForm, setCompanyForm] = useState<CompanyRegistrationData>({
    companyName: "",
    industry: Industry.FINANCE,
    logoUrl: "",
    securitiesCode: "",
    establishedDate: "",
    address: "",
    phone: "",
    ceo: "",
    businessDescription: "",
    capital: "",
    employeeCount: 0,
    websiteUrl: "",
    contactEmail: "",
  });

  // チームメンバーはメールアドレスのみ入力
  const [teamMemberEmail, setTeamMemberEmail] = useState<string>("");

  const [companyId, setCompanyId] = useState<CompanyId>("");
  const [companyResult, setCompanyResult] = useState<any>(null);
  const [teamMemberResult, setTeamMemberResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleCompanyInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({
      ...prev,
      [name]: name === "employeeCount" ? Number(value) : value,
    }));
  };

  const handleTeamMemberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTeamMemberEmail(e.target.value);
  };

  // ランダムなパスワードを生成（8文字）
  const generateRandomPassword = (length: number = 8) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCompanySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/admin/company/admin/company/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });
      if (!response.ok) {
        throw new Error("企業アカウントの作成に失敗しました");
      }
      const data = await response.json();
      setCompanyId(data.companyId);
      setCompanyResult(data);
    } catch (err: any) {
      setError(err.message || "エラーが発生しました");
    }
  };

  const handleTeamMemberSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    if (!companyId) {
      setError("先に企業アカウントを作成してください");
      return;
    }
    const password = generateRandomPassword();
    const registrationData: CorporateUserRegistrationData = {
      email: teamMemberEmail,
      password,
      company_id: companyId,
      is_admin: false,
    };
    try {
      const response = await fetch("/api/admin/corporate/admin/corporate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });
      if (!response.ok) {
        throw new Error("チームメンバーアカウントの作成に失敗しました");
      }
      const data = await response.json();
      // 生成したパスワードを含めた結果を表示
      setTeamMemberResult({ ...data, generatedPassword: password });
    } catch (err: any) {
      setError(err.message || "エラーが発生しました");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold leading-relaxed">
        管理者用アカウント作成ページ
      </h1>
      {error && <div className="text-red-600">{error}</div>}

      {/* 企業アカウント作成フォーム */}
      <section className="bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold leading-relaxed mb-4">
          企業アカウント作成
        </h2>
        <form onSubmit={handleCompanySubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                企業名
              </label>
              <input
                type="text"
                name="companyName"
                value={companyForm.companyName}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                証券コード
              </label>
              <input
                type="text"
                name="securitiesCode"
                value={companyForm.securitiesCode}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                設立日
              </label>
              <input
                type="date"
                name="establishedDate"
                value={companyForm.establishedDate}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                住所
              </label>
              <input
                type="text"
                name="address"
                value={companyForm.address}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                電話番号
              </label>
              <input
                type="text"
                name="phone"
                value={companyForm.phone}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CEO
              </label>
              <input
                type="text"
                name="ceo"
                value={companyForm.ceo}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                業界
              </label>
              <select
                name="industry"
                value={companyForm.industry}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              >
                <option value="">業界を選択してください</option>
                {INDUSTRY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                事業内容
              </label>
              <textarea
                name="businessDescription"
                value={companyForm.businessDescription}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                資本金
              </label>
              <input
                type="text"
                name="capital"
                value={companyForm.capital}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                従業員数
              </label>
              <input
                type="number"
                name="employeeCount"
                value={companyForm.employeeCount}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ウェブサイトURL
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={companyForm.websiteUrl}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                連絡先メール
              </label>
              <input
                type="email"
                name="contactEmail"
                value={companyForm.contactEmail}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ロゴURL
              </label>
              <input
                type="text"
                name="logoUrl"
                value={companyForm.logoUrl}
                onChange={handleCompanyInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-800"
          >
            企業アカウント発行
          </button>
        </form>
        {companyResult && (
          <div className="mt-4 p-4 border border-green-300 text-green-700 rounded">
            企業アカウントが作成されました。<br />
            企業ID: {companyResult.companyId}
          </div>
        )}
      </section>

      {/* チームメンバーアカウント作成フォーム */}
      <section className="bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold leading-relaxed mb-4">
          チームメンバーアカウント作成
        </h2>
        {companyId ? (
          <form onSubmit={handleTeamMemberSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                value={teamMemberEmail}
                onChange={handleTeamMemberInputChange}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-800"
            >
              チームメンバーアカウント発行
            </button>
          </form>
        ) : (
          <div className="text-sm text-gray-500">
            先に企業アカウントを作成してください
          </div>
        )}
        {teamMemberResult && (
          <div className="mt-4 p-4 border border-green-300 text-green-700 rounded">
            チームメンバーアカウントが作成されました。<br />
            メール: {teamMemberResult.email} <br />
            生成されたパスワード: {teamMemberResult.generatedPassword}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminAccountCreationPage;
