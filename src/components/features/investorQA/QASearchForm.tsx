"use client";

import React, { useState } from "react";
import { QASearchFormProps } from "@/types/components";

export default function QASearchForm({
  keyword,
  selectedCompany,
  onSearch,
}: // onChangeKeyword, onChangeCompany, ...
QASearchFormProps) {
  const [tempKeyword, setTempKeyword] = useState(keyword);
  const [tempCompany, setTempCompany] = useState(selectedCompany);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ keyword: tempKeyword, company: tempCompany });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex items-center gap-2">
      <input
        type="text"
        placeholder="キーワード"
        className="border border-gray-300 rounded px-2 py-1 w-72"
        value={tempKeyword}
        onChange={(e) => setTempKeyword(e.target.value)}
      />
      <select
        value={tempCompany}
        onChange={(e) => setTempCompany(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1"
      >
        <option value="">全企業</option>
        <option value="apple">Apple</option>
        <option value="google">Google</option>
        <option value="fintech">FinTech Corp</option>
      </select>
      <button
        type="submit"
        className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition-colors"
      >
        検索
      </button>
    </form>
  );
}
