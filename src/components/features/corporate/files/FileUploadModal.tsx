"use client";

import React, { useState, useRef, useCallback } from 'react';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import FiscalPeriodSelect from '@/components/ui/FiscalPeriodSelect';
import { INFO_SOURCE_OPTIONS } from '@/components/ui/tagConfig';
import { Upload, X, FileText } from 'lucide-react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, fiscalYear: string, documentType: string) => Promise<void>;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fiscalYear, setFiscalYear] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 直近3年分の決算期を生成
  const generateFiscalPeriods = () => {
    const currentYear = new Date().getFullYear();
    const periods = [];
    for (let year = currentYear; year >= currentYear - 2; year--) {
      for (let quarter = 1; quarter <= 4; quarter++) {
        periods.push({
          value: `${year}-Q${quarter}`,
          label: `${year}-Q${quarter}`
        });
      }
    }
    return periods;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFile = droppedFiles.find(f => f.type === 'application/pdf');
    
    if (pdfFile) {
      setFile(pdfFile);
    } else {
      alert('PDFファイルのみアップロード可能です');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        alert('PDFファイルのみアップロード可能です');
        e.target.value = ''; // inputをリセット
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !fiscalYear || !documentType) {
      alert('すべての項目を入力してください');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file, fiscalYear, documentType);
      handleClose();
    } catch (error) {
      console.error('アップロードエラー:', error);
      alert('アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setFiscalYear('');
    setDocumentType('');
    onClose();
  };

  // INFO_SOURCE_OPTIONSをSelectコンポーネントで使用できるように変換
  const documentTypeOptions = INFO_SOURCE_OPTIONS.map(option => ({
    label: option.label,
    value: option.label
  }));

  // 決算期のオプションを生成（空の選択肢を含む）
  const fiscalYearOptions = [
    { label: '選択してください', value: '' },
    ...generateFiscalPeriods()
  ];

  // 資料種類のオプションを生成（空の選択肢を含む）
  const documentOptions = [
    { label: '選択してください', value: '' },
    ...documentTypeOptions
  ];

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">ファイルアップロード</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ファイルドロップエリア */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 mb-4 transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-center cursor-pointer">
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    PDFファイルをドラッグ&ドロップ
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    またはクリックしてファイルを選択
                  </p>
                </>
              )}
            </div>
          </div>

          {/* 対象決算期 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              対象決算期
            </label>
            <FiscalPeriodSelect
              value={fiscalYear}
              onChange={setFiscalYear}
              includeEmpty={true}
              className="w-full"
            />
          </div>

          {/* 資料種類 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              資料種類
            </label>
            <Select
              options={documentOptions}
              value={documentType}
              onChange={setDocumentType}
              className="w-full"
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              label="キャンセル"
            />
            <Button
              onClick={handleUpload}
              disabled={!file || !fiscalYear || !documentType || isUploading}
              label={isUploading ? 'アップロード中...' : 'アップロード'}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}; 