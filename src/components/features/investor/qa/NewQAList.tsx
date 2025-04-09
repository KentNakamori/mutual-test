"use client";

import React from "react";
import { QA } from "@/types";

interface NewQAListProps {
  // モックデータ用に会社名を含めた拡張型として受け取る（実際のAPIではQAに会社名が含まれる前提）
  qas: (QA & { companyName?: string })[];
}

const NewQAList: React.FC<NewQAListProps> = ({ qas }) => {
  const sortedQAs = [...qas].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleRowClick = (qa: QA) => {
    window.location.assign(`/investor/company/${qa.companyId}?tab=qa`);
  };

  // 5行に満たない場合は空行を追加（各行は h-8）
  const fillerRowsCount = Math.max(0, 5 - sortedQAs.length);
  const fillerRows = Array.from({ length: fillerRowsCount });

  return (
    <section className="mb-8
    ">
      <h2 className="text-xl font-bold mb-4">新着QA</h2>
      {/* コンテナの高さは以前と同じ 18rem */}
      <div className="overflow-x-auto" style={{ height: "10rem" }}>
        <table className="table-auto border-collapse w-full">
          <tbody>
            {sortedQAs.map((qa) => (
              <tr
                key={qa.qaId}
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 h-8"
                onClick={() => handleRowClick(qa)}
              >
                <td className="border-b border-gray-200 px-2 py-1 text-xs text-gray-700">
                  {new Date(qa.createdAt).toLocaleDateString()}
                </td>
                <td className="border-b border-gray-200 px-2 py-1 text-xs text-gray-700">
                  {qa.companyName || qa.companyId}
                </td>
                <td className="border-b border-gray-200 px-2 py-1 text-xs text-gray-700">
                  {qa.title}
                </td>
                <td className="border-b border-gray-200 px-2 py-1 text-xs text-gray-700">
                  {qa.tags.join(", ")}
                </td>
              </tr>
            ))}
            {/* QA件数が5未満の場合は、同じ高さの空行を補完 */}
            {fillerRows.map((_, index) => (
              <tr key={`filler-${index}`} className="h-8">
                <td className="border-b border-gray-200 px-2 py-1" colSpan={4}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default NewQAList;
