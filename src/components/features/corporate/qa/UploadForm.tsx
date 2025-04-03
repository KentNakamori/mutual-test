// src/components/features/corporate/qa/UploadForm.tsx
import React, { useState, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { UploadFormProps, Option} from '@/types';



const materialTypeOptions: Option[] = [
  { label: 'マニュアル', value: 'マニュアル' },
  { label: '仕様書', value: '仕様書' },
  { label: 'その他', value: 'その他' },
];

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess, onUploadError, materialType, onMaterialTypeChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // ドラッグ＆ドロップ処理
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setStatus('uploading');
    // シミュレーション: アップロードと AI解析の進捗を表示
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + 20;
        if (next >= 100) {
          clearInterval(interval);
          setStatus('success');
          // モック: AI による Q&A 生成候補（資料種類によって生成内容が変わる前提）
          onUploadSuccess([
            {
              qaId: Date.now().toString(),
              question: `${materialType} 資料に基づく質問例？`,
              answer: 'これは AI による生成回答です。',
              companyId: 'comp1',
              likeCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isPublished: false,
              views: 0,
            },
            {
              qaId: (Date.now() + 1).toString(),
              question: `${materialType} 資料に基づく別の質問例？`,
              answer: 'こちらも AI による生成回答です。',
              companyId: 'comp1',
              likeCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isPublished: false,
              views: 0,
            },
          ]);
        }
        return next;
      });
    }, 300);
  };

  return (
    <div className="space-y-4">
      {/* 資料種類選択UI */}
      <div>
        <label className="block text-sm font-medium mb-1">資料種類</label>
        <Select
          options={materialTypeOptions}
          value={materialType}
          onChange={onMaterialTypeChange}
        />
      </div>
      {/* ファイル選択ボタン */}
      <div>
        <label className="block text-sm font-medium mb-1">ファイルを選択</label>
        <input type="file" onChange={handleFileChange} className="mb-2" />
      </div>
      {/* ドラッグ＆ドロップエリア */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 p-6 text-center rounded mb-2"
      >
        {selectedFile ? (
          <p>{selectedFile.name} が選択されています</p>
        ) : (
          <p>ここにファイルをドラッグ＆ドロップしてください</p>
        )}
      </div>
      {/* アップロード進捗表示 */}
      {status === 'uploading' && (
        <div className="w-full bg-gray-200 rounded h-2">
          <div className="bg-black h-2 rounded" style={{ width: `${uploadProgress}%` }}></div>
        </div>
      )}
      <Button label="アップロード" onClick={handleUpload} disabled={!selectedFile || status === 'uploading'} />
      {/* ステップバー表示 */}
      <div className="mt-4">
        <p className="text-sm text-gray-600">Step 1: ファイルアップロード → Step 2: AIによるQ&A生成 → Step 3: 生成候補のレビュー・一括登録</p>
      </div>
    </div>
  );
};

export default UploadForm;
