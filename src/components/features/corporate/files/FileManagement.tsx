"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { FileList } from './FileList';
import { FileUploadModal } from './FileUploadModal';
import { PDFPreviewModal } from './PDFPreviewModal';
import { Plus } from 'lucide-react';
import {
  getCorporateFiles,
  uploadCorporateFile,
  deleteCorporateFile,
} from '@/lib/api';
import { FileManagementResponse, FileCollection } from '@/types';
import Select from '@/components/ui/Select';
import UploadButton from '@/components/features/corporate/qa/UploadButton';

export const FileManagement: React.FC = () => {
  const [fileData, setFileData] = useState<FileManagementResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileCollection | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [selectedFiscalPeriod, setSelectedFiscalPeriod] = useState<string>('');

  // ファイル一覧を取得
  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await getCorporateFiles();
      setFileData(response);
    } catch (error) {
      console.error('ファイル一覧の取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // ファイルアップロード
  const handleUpload = async (file: File, fiscalPeriod: string, documentType: string) => {
    try {
      await uploadCorporateFile(file, fiscalPeriod, documentType);
      await fetchFiles();
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('アップロードエラー:', error);
      throw error;
    }
  };

  // ファイル削除
  const handleDelete = async (fileId: string) => {
    if (!confirm('このファイルを削除してもよろしいですか？')) {
      return;
    }

    try {
      await deleteCorporateFile(fileId);
      await fetchFiles();
    } catch (error) {
      console.error('削除エラー:', error);
      alert('ファイルの削除に失敗しました');
    }
  };

  // ファイルクリック（PDFプレビュー表示）
  const handleFileClick = (file: FileCollection) => {
    if (file.s3Url) {
      setSelectedFile(file);
      setIsPDFPreviewOpen(true);
    }
  };

  // 資料種類のオプションを生成
  const documentTypeOptions = useMemo(() => {
    if (!fileData) return [];
    const types = new Set(fileData.files.map(file => file.documentType));
    return [
      { label: 'すべて', value: '' },
      ...Array.from(types).map(type => ({ label: type, value: type }))
    ];
  }, [fileData]);

  // フィルタリングされたファイル一覧
  const filteredFiles = useMemo(() => {
    if (!fileData) return [];
    return fileData.files.filter(file => {
      const matchesDocumentType = !selectedDocumentType || file.documentType === selectedDocumentType;
      
      // 年度のみが選択されている場合
      if (selectedFiscalPeriod && !selectedFiscalPeriod.includes('-Q')) {
        const fileYear = file.fiscalPeriod.split('-Q')[0];
        return matchesDocumentType && fileYear === selectedFiscalPeriod;
      }
      
      // 年度と四半期が選択されている場合
      const matchesFiscalPeriod = !selectedFiscalPeriod || file.fiscalPeriod === selectedFiscalPeriod;
      return matchesDocumentType && matchesFiscalPeriod;
    });
  }, [fileData, selectedDocumentType, selectedFiscalPeriod]);

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            IRドキュメントや財務資料をアップロードして管理できます
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#1CB5E0] to-[#9967EE] text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-sm"
        >
          資料をアップロード
        </button>
      </div>

      {/* フィルター */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            資料種類
          </label>
          <Select
            options={documentTypeOptions}
            value={selectedDocumentType}
            onChange={setSelectedDocumentType}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            対象決算期
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={selectedFiscalPeriod.split('-Q')[0] || ''}
                onChange={(e) => {
                  const year = e.target.value;
                  const quarter = selectedFiscalPeriod.split('-Q')[1] || '';
                  setSelectedFiscalPeriod(quarter ? `${year}-Q${quarter}` : year);
                }}
                placeholder="年度"
                className="w-20 px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1900"
                max="2100"
              />
              <span className="text-gray-600">年度</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Q</span>
              <input
                type="number"
                value={selectedFiscalPeriod.split('-Q')[1] || ''}
                onChange={(e) => {
                  const year = selectedFiscalPeriod.split('-Q')[0] || '';
                  const quarter = e.target.value;
                  setSelectedFiscalPeriod(year ? `${year}-Q${quarter}` : `Q${quarter}`);
                }}
                placeholder="Q"
                className="w-16 px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="99"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ファイル一覧 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">アップロード済みファイル</h2>
          <FileList 
            files={filteredFiles} 
            onDelete={handleDelete}
            onFileClick={handleFileClick}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* アップロードモーダル */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      {/* PDFプレビューモーダル */}
      {selectedFile && (
        <PDFPreviewModal
          isOpen={isPDFPreviewOpen}
          onClose={() => {
            setIsPDFPreviewOpen(false);
            setSelectedFile(null);
          }}
          fileName={selectedFile.fileName}
          pdfUrl={selectedFile.s3Url!}
        />
      )}
    </div>
  );
}; 