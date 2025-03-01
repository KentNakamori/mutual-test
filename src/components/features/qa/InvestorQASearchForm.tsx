/**
 * @file InvestorQASearchForm.tsx
 * @description 投資家向けのQA横断検索フォーム
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/Button"; // shadcnのButtonを想定
import Input from "@/components/ui/Input";        // ラップ済みInput(例)
import Select from "@/components/ui/Select";      // ラップ済みSelect(例)

/**
 * 検索条件
 */
type SearchConditions = {
  keyword: string;
  company: string; // 企業ID or 企業名 or "all" など
};

type InvestorQASearchFormProps = {
  /** 検索実行時に親コンポーネントへ引数を渡すコールバック */
  onSearch: (conditions: SearchConditions) => void;
  /** 初期キーワード */
  initialKeyword?: string;
  /**
   * 初期企業フィルタ (企業IDなど)
   *  - すべての企業を表したい場合は "all" を指定 (空文字はSelectで使えない)
   */
  initialCompany?: string;
};

const InvestorQASearchForm: React.FC<InvestorQASearchFormProps> = ({
  onSearch,
  initialKeyword = "",
  initialCompany = "all", // ← 空文字ではなく "all" を初期値に
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [company, setCompany] = useState(initialCompany);

  // 企業リストが必要であれば別途APIやhooksで取得 (ここでは固定サンプル)
  // ※ "all" の代わりに "none" や "any" など、実装に合わせた文字列を使ってもOK
  const companyOptions = [
    { value: "all", label: "すべての企業" }, // ← 空文字("")ではなく "all"
    { value: "company-123", label: "Sample Company A" },
    { value: "company-456", label: "Sample Company B" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // フォーム入力値をそのままonSearchに渡す
    onSearch({ keyword, company });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      {/* キーワード入力 */}
      <div>
        <Input
          label="キーワード"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="キーワードを入力"
        />
      </div>

      {/* 企業選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          企業を選択
        </label>
        <Select
          options={companyOptions}
          value={company}
          onChange={(val) => setCompany(val)}
          placeholder="企業を選択" // 何も選択していない状態の表示
        />
      </div>

      {/* 検索ボタン */}
      <Button variant="default" type="submit" className="mt-2">
        検索
      </Button>
    </form>
  );
};

export default InvestorQASearchForm;
