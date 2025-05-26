// src/components/features/investor/companies/NewQAList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { QA } from "@/types";
import { getTagColor } from "@/components/ui/tagConfig";
import { getLatestQAs } from "@/lib/api";
import { useUser } from "@auth0/nextjs-auth0";

interface NewQAListProps {
  onRowClick?: (qa: QA) => void;
}

const NewQAList: React.FC<NewQAListProps> = ({ onRowClick }) => {
  const { user, isLoading: userLoading } = useUser();
  const [qas, setQas] = useState<QA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 新着QAデータを取得
  useEffect(() => {
    const fetchLatestQAs = async () => {
      if (userLoading) return; // ユーザー情報のロード中は処理しない
      
      setLoading(true);
      setError(null);
      try {
        // Auth0 SDK v4用の対応：token=undefinedにしてプロキシ経由で認証情報を送信
        const response = await getLatestQAs(undefined, 10);
        console.log('新着QA取得結果:', response);
        
        // 企業IDの異なるQAを最大10個まで取得（重複する企業IDを除外）
        const uniqueCompanyQAs: QA[] = [];
        const seenCompanyIds = new Set<string>();
        
        for (const qa of response.results) {
          if (!seenCompanyIds.has(qa.companyId) && uniqueCompanyQAs.length < 10) {
            seenCompanyIds.add(qa.companyId);
            uniqueCompanyQAs.push(qa as QA);
          }
        }
        
        setQas(uniqueCompanyQAs);
      } catch (err) {
        console.error('新着QAの取得に失敗しました', err);
        setError('新着QAの取得に失敗しました。再度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    
    // ユーザー認証状態に基づいて処理
    if (!userLoading) {
      fetchLatestQAs();
    }
  }, [userLoading]);

  const sortedQAs = [...qas].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // 5行に満たない場合は空行を追加（各行は h-8）
  const fillerRowsCount = Math.max(0, 5 - sortedQAs.length);
  const fillerRows = Array.from({ length: fillerRowsCount });

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">新着QA</h2>
      
      {/* ローディング表示 */}
      {loading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">データを読み込み中...</span>
        </div>
      )}
      
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "20rem", minHeight: "10rem" }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
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
                資料
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!loading && !error && sortedQAs.map((qa) => (
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
                    {qa.tags && qa.tags.length > 0 && qa.tags[0] && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(qa.tags[0])}`}
                      >
                        {qa.tags[0]}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {/* データが5行未満の場合のみ空行を追加 */}
            {!loading && !error && sortedQAs.length < 5 && fillerRows.map((_, index) => (
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
