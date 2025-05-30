"use client";

import React, { useState, useRef, useCallback } from 'react';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import FiscalPeriodSelect from '@/components/ui/FiscalPeriodSelect';
import { INFO_SOURCE_OPTIONS } from '@/components/ui/tagConfig';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, fiscalPeriod: string, documentType: string) => Promise<void>;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fiscalPeriod, setFiscalPeriod] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイルサイズ制限（200MB）
  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes

  const validateFile = (selectedFile: File): string | null => {
    // PDFファイル形式チェック
    if (selectedFile.type !== 'application/pdf') {
      return 'PDFファイルのみアップロード可能です。対応形式: .pdf';
    }
    
    // ファイルサイズチェック（200MB制限）
    if (selectedFile.size > MAX_FILE_SIZE) {
      const sizeMB = Math.round((selectedFile.size / (1024 * 1024)) * 100) / 100;
      return `ファイルサイズが制限を超えています。現在: ${sizeMB}MB、制限: 200MB以下`;
    }
    
    return null;
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
    setError('');

    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFile = droppedFiles[0];
    
    if (pdfFile) {
      const validationError = validateFile(pdfFile);
      if (validationError) {
        setError(validationError);
        return;
      }
      setFile(pdfFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');
    
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        e.target.value = ''; // inputをリセット
        return;
      }
      setFile(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    // 必須項目のバリデーション
    if (!file) {
      setError('ファイルを選択してください');
      return;
    }
    if (!fiscalPeriod || fiscalPeriod.trim() === '' || fiscalPeriod === '選択してください') {
      setError('対象決算期を選択してください');
      return;
    }
    if (!documentType || documentType.trim() === '' || documentType === '選択してください') {
      setError('資料種類を選択してください');
      return;
    }

    setIsUploading(true);
    setError('');
    
    try {
      await onUpload(file, fiscalPeriod.trim(), documentType.trim());
      handleClose();
    } catch (error) {
      console.error('アップロードエラー:', error);
      if (error instanceof Error) {
        setError(`アップロードに失敗しました: ${error.message}`);
      } else {
        setError('アップロードに失敗しました');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setFiscalPeriod('');
    setDocumentType('');
    setError('');
    onClose();
  };

  // INFO_SOURCE_OPTIONSをSelectコンポーネントで使用できるように変換
  const documentTypeOptions = INFO_SOURCE_OPTIONS.map(option => ({
    label: option.label,
    value: option.label
  }));

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

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

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
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    ファイルサイズ: {formatFileSize(file.size)}
                  </p>
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
                  <p className="text-xs text-gray-400 mt-2">
                    ※ 200MB以下のPDFファイルのみ対応
                  </p>
                </>
              )}
            </div>
          </div>

          {/* 対象決算期 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              対象決算期 <span className="text-red-500">*</span>
            </label>
            <FiscalPeriodSelect
              value={fiscalPeriod}
              onChange={setFiscalPeriod}
              className="w-full"
            />
            {!fiscalPeriod && (
              <p className="text-xs text-gray-500 mt-1">
                例: 2024年第3四半期の場合は「2024年度」と「Q3」を入力
              </p>
            )}
          </div>

          {/* 資料種類 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              資料種類 <span className="text-red-500">*</span>
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
              disabled={!file || !fiscalPeriod || !documentType || isUploading}
              label={isUploading ? 'アップロード中...' : 'アップロード'}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}; 