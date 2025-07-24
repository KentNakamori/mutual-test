// src/components/features/investor/companies/NewQAList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QA } from "@/types";
import { getTagColor } from "@/components/ui/tagConfig";
import { useUser } from "@auth0/nextjs-auth0";
import { getLatestQAsByCompany } from "@/lib/api/investor";
import QaDetailModal from "@/components/ui/QaDetailModal";
import GuestRestrictedContent from "@/components/features/investor/common/GuestRestrictedContent";

interface NewQAListProps {
  onRowClick?: (qa: QA) => void;
}

const NewQAList: React.FC<NewQAListProps> = ({ onRowClick }) => {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [qas, setQas] = useState<QA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const [showGuestPopup, setShowGuestPopup] = useState(false);

  // ゲスト判定
  const isGuest = !user && !userLoading;

  // 最新QAを取得
  useEffect(() => {
    const fetchLatestQAs = async () => {
      if (userLoading) return; // ユーザー情報のロード中は処理しない
      
      setLoading(true);
      setError(null);
      try {
        console.log('最新QA取得開始');
        
        // getLatestQAsByCompany API関数を使用（ゲストユーザーの場合はtokenなし）
        const token = user?.sub;
        const data = await getLatestQAsByCompany(token, 10);
        
        console.log('最新QA取得結果:', data);
        
        // APIレスポンスから結果を取得
        if (data.results) {
          // バックエンドから返される'categories'フィールドを'category'にマッピング
          const mappedQAs = data.results.map((qa: any) => ({
            ...qa,
            category: qa.categories || qa.category || [], // categoriesがあればそれを使用、なければcategoryを使用、どちらもなければ空配列
          }));
          
          // 作成日時順にソート（新しい順）- APIで既にソートされているが念のため
          const sortedQAs = mappedQAs.sort(
            (a: QA, b: QA) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          setQas(sortedQAs);
        } else {
          console.error('予期しないAPIレスポンス形式:', data);
          setError('予期しないAPIレスポンス形式です');
          setQas([]);
        }
      } catch (err) {
        console.error('最新QAの取得に失敗しました', err);
        
        // 認証エラーの場合は、ゲストユーザー向けのメッセージを表示
        if (err instanceof Error && (err.message.includes('401') || err.message.includes('Unauthorized'))) {
          if (!user) {
            // ゲストユーザーの場合は、バックエンドの認証設定が必要であることを示す
            setError('現在、ゲストユーザーでの新着QA表示は準備中です。ログインしてご利用ください。');
          } else {
            setError('認証エラーが発生しました。再度ログインしてください。');
          }
        } else {
          setError('最新QAの取得に失敗しました。再度お試しください。');
        }
        setQas([]);
      } finally {
        setLoading(false);
      }
    };
    
    // ユーザー認証状態に基づいて処理
    if (!userLoading) {
      fetchLatestQAs();
    }
  }, [userLoading, user?.sub, user]);

  // QA行クリック処理
  const handleRowClick = (qa: QA) => {
    if (onRowClick) {
      onRowClick(qa);
    } else {
      // onRowClickが提供されていない場合は、内部でモーダルを開く
      setSelectedQA(qa);
    }
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setSelectedQA(null);
  };

  // ブックマーク処理
  const handleLike = async (qaId: string) => {
    if (isGuest) {
      // ゲストユーザーの場合はポップアップを表示
      setShowGuestPopup(true);
      return;
    }

    // 認証済みユーザーの場合のブックマーク処理
    // TODO: 実際のいいね機能を実装
    console.log('ブックマーク処理:', qaId);
  };

  // 企業名クリック処理
  const handleCompanyNameClick = (e: React.MouseEvent, companyId: string) => {
    e.stopPropagation(); // 行のクリックイベントを停止
    router.push(`/investor/company/${companyId}`);
  };

  // 5行に満たない場合は空行を追加（各行は h-8）
  const fillerRowsCount = Math.max(0, 5 - qas.length);
  const fillerRows = Array.from({ length: fillerRowsCount });

  return (
    <>
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
            {error.includes('ゲストユーザー') ? (
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => window.location.href = '/api/auth/investor-login'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  ログインする
                </button>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200 transition-colors"
                >
                  再読み込み
                </button>
              </div>
            ) : (
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
              >
                再読み込み
              </button>
            )}
          </div>
        )}
        
        {/* カードスタイルのテーブルコンテナ */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
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
                    質問ルート
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!loading && !error && qas.map((qa) => (
                  <tr
                    key={qa.qaId}
                    onClick={() => handleRowClick(qa)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 h-8"
                  >
                    <td className="px-6 py-1 whitespace-nowrap text-xs text-gray-500">
                      {new Date(qa.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs text-gray-700">
                      <span 
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={(e) => handleCompanyNameClick(e, qa.companyId)}
                      >
                        {qa.companyName || qa.companyId}
                      </span>
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs text-blue-600 hover:text-blue-800">
                      {qa.title}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-xs">
                      <div className="flex flex-wrap gap-1">
                        {qa.question_route && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(qa.question_route)}`}
                          >
                            {qa.question_route}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {/* データが空の場合のメッセージ */}
                {!loading && !error && qas.length === 0 && (
                  <tr className="h-32">
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="text-gray-500">
                        {!user ? (
                          <div>
                            <p className="text-sm mb-2">新着QAを表示するにはログインが必要です</p>
                            <button 
                              onClick={() => window.location.href = '/api/auth/investor-login'}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                            >
                              ログインする
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm">新着QAはありません</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {/* データが5行未満の場合のみ空行を追加 */}
                {!loading && !error && qas.length > 0 && qas.length < 5 && fillerRows.map((_, index) => (
                  <tr key={`filler-${index}`} className="h-8">
                    <td className="px-6 py-1" colSpan={4}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* QADetailModal */}
      {selectedQA && (
        <QaDetailModal
          qa={selectedQA}
          role="investor"
          isOpen={true}
          onClose={handleCloseModal}
          onLike={handleLike}
        />
      )}

      {/* ゲスト制限ポップアップ */}
      {showGuestPopup && (
        <GuestRestrictedContent 
          featureName="ブックマーク" 
          isPopup={true}
          onClose={() => setShowGuestPopup(false)}
        />
      )}
    </>
  );
};

export default NewQAList;
