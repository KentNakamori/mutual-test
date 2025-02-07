'use client'

import React, { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { QAStatusBadge } from '../../../common/qa/QAStatusBadge';
import { QAPriorityTag } from '../../../common/qa/QAPriorityTag';
import { QATimelineEvent } from '../../../common/qa/QATimelineEvent';
import type { QA, QAResponse, QAAttachment } from '../../../../types/models';

interface QADetailProps {
  qa: QA;
  currentUser: {
    id: string;
    name: string;
  };
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onRespond: (response: Omit<QAResponse, 'timestamp' | 'user_id'>) => Promise<void>;
}

export const QADetail: React.FC<QADetailProps> = ({
  qa,
  currentUser,
  onStatusChange,
  onPriorityChange,
  onRespond
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseContent, setResponseContent] = useState('');
  const [attachments, setAttachments] = useState<QAAttachment[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseContent.trim() && attachments.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await onRespond({
        content: responseContent,
        attachments
      });
      setResponseContent('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to submit response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    try {
      const newAttachments = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      setAttachments([...attachments, ...newAttachments]);
    } catch (error) {
      console.error('Failed to process files:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Q{qa._id.slice(-4)}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>作成: {new Date(qa.created_at).toLocaleString()}</span>
              <span>更新: {new Date(qa.updated_at).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={qa.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="p-2 border border-gray-200 rounded-md text-sm"
            >
              <option value="new">新規</option>
              <option value="in_progress">対応中</option>
              <option value="resolved">解決済み</option>
              <option value="closed">完了</option>
            </select>
            <select
              value={qa.priority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="p-2 border border-gray-200 rounded-md text-sm"
            >
              <option value="high">優先度: 高</option>
              <option value="medium">優先度: 中</option>
              <option value="low">優先度: 低</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <QAStatusBadge status={qa.status} />
          <QAPriorityTag priority={qa.priority} />
        </div>
        
        <div className="border-t border-gray-200 -mx-6">
          {qa.responses.map((response, index) => (
            <QATimelineEvent
              key={index}
              response={response}
              user={{
                id: response.user_id,
                name: `User ${response.user_id.slice(-4)}` // 実際のユーザー名を取得する必要あり
              }}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <textarea
          value={responseContent}
          onChange={(e) => setResponseContent(e.target.value)}
          placeholder="回答を入力してください..."
          className="w-full p-4 border border-gray-200 rounded-lg mb-4 min-h-[120px] resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        
        {attachments.length > 0 && (
          <div className="mb-4 space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <Paperclip size={16} className="text-gray-500" />
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments(files => files.filter((_, i) => i !== index))}
                  className="text-red-600 hover:text-red-800"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <input
              type="file"
              id="file-upload"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <Paperclip size={16} className="mr-2" />
              添付ファイル
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || (!responseContent.trim() && attachments.length === 0)}
            className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>送信中...</span>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                送信
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
