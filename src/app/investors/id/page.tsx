'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { InvestorProfile } from '@/components/features/investors/InvestorDetail/InvestorProfile';
import { InvestorHistory } from '@/components/features/investors/InvestorDetail/InvestorHistory';
import { InvestorContact } from '@/components/features/investors/InvestorDetail/InvestorContact';
import type { Investor } from '@/types/models';
import { API_ENDPOINTS } from '@/types/utils';

export default function InvestorDetailPage() {
  const params = useParams();
  const investorId = params.id as string;
  
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvestorDetail();
  }, [investorId]);

  const fetchInvestorDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_ENDPOINTS.INVESTORS}/${investorId}`);
      
      if (!response.ok) {
        throw new Error('投資家データの取得に失敗しました');
      }

      const data = await response.json();
      setInvestor(data.data);
    } catch (error) {
      console.error('Error fetching investor:', error);
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData: Partial<Investor>) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.INVESTORS}/${investorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('投資家データの更新に失敗しました');
      }

      const data = await response.json();
      setInvestor(data.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating investor:', error);
      // エラーハンドリングは後で実装
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !investor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || '投資家データが見つかりません'}
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold leading-relaxed">
          {investor.basicInfo.name} - 投資家詳細
        </h1>
        <button
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? '編集をキャンセル' : '編集する'}
        </button>
      </div>

      <div className="space-y-8">
        <InvestorProfile
          investor={investor}
          editable={isEditing}
          onUpdate={handleUpdate}
        />

        <InvestorHistory
          meetings={investor.meetings}
          qas={investor.qas}
        />

        <InvestorContact
          investor={investor}
          editable={isEditing}
          onUpdate={handleUpdate}
        />
      </div>
    </main>
  );
}