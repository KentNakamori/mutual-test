'use client'

import React, { useState } from 'react';
import { Paperclip, Send, X } from 'lucide-react';
import type { QAResponse, QAAttachment } from '../../../../types/models';

interface QAResponseFormProps {
  onRespond: (response: Omit<QAResponse, 'timestamp' | 'user_id'>) => Promise<void>;
  isSubmitting?: boolean;
}

export const QAResponseForm: React.FC<QAResponseFormProps> = ({
  onRespond,
  isSubmitting = false
}) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<QAAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && attachments.length === 0) return;

    try {
      await onRespond({
        content: content.trim(),
        attachments
      });
      setContent('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to submit response:', error);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    try {
      const newAttachments = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    } catch (error) {
      console.error('Failed to process files:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <div
        className={`relative mb-4 ${isDragging ? 'bg-gray-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="回答を入力してください..."
          className="w-full p-4 border border-gray-200 rounded-lg resize-y min-h-[120px] focus:ring-2 focus:ring-black focus:border-transparent"
          disabled={isSubmitting}
        />
        {isDragging && (
          <div className="absolute inset-0 bg-gray-50 bg-opacity-90 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            <span className="text-gray-500">ファイルをドロップしてアップロード</span>
          </div>
        )}
      </div>

      {attachments.length > 0 && (
        <div className="mb-4 space-y-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <Paperclip size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setAttachments(files => files.filter((_, i) => i !== index))}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={isSubmitting}
          />
          <label
            htmlFor="file-upload"
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <Paperclip size={16} />
            <span>添付ファイル</span>
          </label>
          {attachments.length > 0 && (
            <span className="text-sm text-gray-500">
              {attachments.length}件のファイル
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || (!content.trim() && attachments.length === 0)}
          className="flex items-center space-x-2 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span>送信中...</span>
          ) : (
            <>
              <Send size={16} />
              <span>送信</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
