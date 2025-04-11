// src/components/features/investor/qa/NewQAList.tsx
"use client";

import React from "react";
import { QA } from "@/types";
import { getTagColor } from "@/components/ui/tagConfig";

interface NewQAListProps {
  // モックデータ用に会社名を含めた拡張型として受け取る（実際のAPIではQAに会社名が含まれる前提）
  qas: (QA & { companyName?: string })[];
  onRowClick?: (qa: QA) => void;
}

const NewQAList: React.FC<NewQAListProps> = ({ qas, onRowClick }) => {
  const sortedQAs = [...qas].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // 5行に満たない場合は空行を追加（各行は h-8）
  const fillerRowsCount = Math.max(0, 5 - sortedQAs.length);
  const fillerRows = Array.from({ length: fillerRowsCount });

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">新着QA</h2>
      <div className="overflow-x-auto" style={{ height: "10rem" }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
              >
                日付
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                企業名
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                タイトル
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                カテゴリー
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedQAs.map((qa) => (
              <tr
                key={qa.qaId}
                onClick={() => onRowClick && onRowClick(qa)}
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 h-8"
              >
                <td className="px-6 py-1 whitespace-nowrap text-xs text-gray-500">
                  {new Date(qa.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-xs text-gray-700">
                  {qa.companyName || qa.companyId}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-xs text-blue-600 hover:text-blue-800">
                  {qa.title}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-xs">
                  <div className="flex flex-wrap gap-1">
                    {qa.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {fillerRows.map((_, index) => (
              <tr key={`filler-${index}`} className="h-8">
                <td className="px-6 py-1" colSpan={4}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default NewQAList;
