"use client";

import React from 'react';
import { FileCollection } from '@/types';
import { Trash2, FileText, Calendar, Tag } from 'lucide-react';

interface FileListProps {
  files: FileCollection[];
  onDelete: (fileId: string) => void;
  onFileClick: (file: FileCollection) => void;
  isLoading?: boolean;
}

export const FileList: React.FC<FileListProps> = ({ files, onDelete, onFileClick, isLoading }) => {
  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600">アップロードされたファイルはありません</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium text-gray-700">ファイル名</th>
            <th className="text-left p-4 font-medium text-gray-700">資料種類</th>
            <th className="text-left p-4 font-medium text-gray-700">対象決算期</th>
            <th className="text-left p-4 font-medium text-gray-700">ファイルサイズ</th>
            <th className="text-left p-4 font-medium text-gray-700">アップロード日</th>
            <th className="text-center p-4 font-medium text-gray-700">操作</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <button
                    onClick={() => onFileClick(file)}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors text-left"
                    disabled={!file.s3Url}
                  >
                    {file.fileName}
                  </button>
                  {!file.s3Url && (
                    <span className="text-xs text-gray-500 ml-2">(処理中)</span>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{file.documentType}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{file.fiscalYear}</span>
                </div>
              </td>
              <td className="p-4 text-sm text-gray-600">
                {formatFileSize(file.fileSize)}
              </td>
              <td className="p-4 text-sm text-gray-600">
                {formatDate(file.uploadDate)}
              </td>
              <td className="p-4 text-center">
                <button
                  onClick={() => onDelete(file.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 