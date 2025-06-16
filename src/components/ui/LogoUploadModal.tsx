"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, AlertCircle } from 'lucide-react';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void; // ファイル選択時のコールバック（S3アップロードはしない）
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
  isOpen,
  onClose,
  onFileSelect,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイルサイズ制限（5MB）
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (selectedFile: File): string | null => {
    // 画像ファイル形式チェック
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      return '画像ファイルのみアップロード可能です。対応形式: PNG, JPEG, JPG, GIF, SVG, WEBP';
    }
    
    // ファイルサイズチェック（5MB制限）
    if (selectedFile.size > MAX_FILE_SIZE) {
      const sizeMB = Math.round((selectedFile.size / (1024 * 1024)) * 100) / 100;
      return `ファイルサイズが制限を超えています。現在: ${sizeMB}MB、制限: 5MB以下`;
    }
    
    return null;
  };

  const createPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
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
    const imageFile = droppedFiles[0];
    
    if (imageFile) {
      const validationError = validateFile(imageFile);
      if (validationError) {
        setError(validationError);
        return;
      }
      setFile(imageFile);
      createPreview(imageFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');
    
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      createPreview(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleConfirm = () => {
    if (!file) {
      setError('ファイルを選択してください');
      return;
    }

    // ファイルを親コンポーネントに渡す（S3アップロードはしない）
    onFileSelect(file);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setPreview('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">ロゴ選択</h2>
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
              ? 'border-blue-500 bg-blue-50'
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
            accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-center cursor-pointer">
            {preview ? (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="w-32 h-20 flex items-center justify-center bg-gray-50 rounded border overflow-hidden">
                    <img 
                      src={preview} 
                      alt="Logo preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Image className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">{file?.name}</span>
                </div>
                <p className="text-xs text-gray-500">
                  ファイルサイズ: {file ? formatFileSize(file.size) : ''}
                </p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  ロゴ画像をドラッグ&ドロップ
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  またはクリックしてファイルを選択
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  ※ 5MB以下の画像ファイル（PNG, JPEG, JPG, GIF, SVG, WEBP）
                </p>
              </>
            )}
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded transition-colors duration-200 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirm}
            disabled={!file}
            className="px-4 py-2 bg-black text-white rounded transition-colors duration-200 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}; 