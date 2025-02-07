'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { QADetail } from '@/components/features/qa/QADetail/QADetail';
import { QAMetadata } from '@/components/features/qa/QADetail/QAMetadata';
import { QAResponseForm } from '@/components/features/qa/QADetail/QAResponseForm';
import type { QA, QAResponse } from '@/types/models';

export default function QADetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [qa, setQA] = useState<QA | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchQA = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/v1/qa/${id}`);
        const json = await response.json();
        setQA(json.data);
      } catch (error) {
        console.error('Failed to fetch QA:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQA();
  }, [id]);

  const updateStatus = async (status: string) => {
    if (!qa) return;
    
    try {
      const response = await fetch(`/api/v1/qa/${qa._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const json = await response.json();
      setQA(json.data);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const updatePriority = async (priority: string) => {
    if (!qa) return;
    
    try {
      const response = await fetch(`/api/v1/qa/${qa._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority })
      });
      const json = await response.json();
      setQA(json.data);
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const addResponse = async (responseData: Omit<QAResponse, 'timestamp' | 'user_id'>) => {
    if (!qa) return;
    
    try {
      const response = await fetch(`/api/v1/qa/${qa._id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
      });
      const json = await response.json();
      setQA(prev => prev ? {
        ...prev,
        responses: [...prev.responses, json.data]
      } : null);
    } catch (error) {
      console.error('Failed to add response:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-40 w-full bg-gray-200 rounded"></div>
            <div className="h-96 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!qa) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            QAが見つかりませんでした
          </h1>
          <button
            onClick={() => router.push('/qa')}
            className="mt-4 inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} />
            <span>一覧に戻る</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          onClick={() => router.push('/qa')}
          className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={16} />
          <span>一覧に戻る</span>
        </button>

        <QAMetadata
          qa={qa}
          onStatusChange={updateStatus}
          onPriorityChange={updatePriority}
        />

        <QADetail
          qa={qa}
          currentUser={{
            id: '1', // ここは実際のユーザー認証システムから取得する
            name: 'User'
          }}
          onStatusChange={updateStatus}
          onPriorityChange={updatePriority}
          onRespond={addResponse}
        />

        <QAResponseForm
          onRespond={addResponse}
        />
      </div>
    </div>
  );
}