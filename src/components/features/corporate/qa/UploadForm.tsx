// src/components/features/qa/UploadForm.tsx
import React, { useState } from 'react';
import Button from '@/components/ui/Button';

export interface UploadFormProps {
  onUploadSuccess: (qas: any[]) => void;
  onUploadError: (error: Error) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess, onUploadError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setStatus('uploading');
    // アップロードと AI 解析をシミュレート
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + 20;
        if (next >= 100) {
          clearInterval(interval);
          setStatus('success');
          // 例：AI により生成された Q&A 候補（モックデータ）
          onUploadSuccess([
            {
              qaId: Date.now().toString(),
              question: 'アップロードされた資料に基づく質問例？',
              answer: 'これは AI による生成回答です。',
              companyId: 'comp1',
              likeCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isPublished: false,
            },
          ]);
        }
        return next;
      });
    }, 300);
  };

  return (
    <div className="space-y-4">
      <input type="file" onChange={handleFileChange} />
      {status === 'uploading' && (
        <div className="w-full bg-gray-200 rounded h-2">
          <div className="bg-black h-2 rounded" style={{ width: `${uploadProgress}%` }}></div>
        </div>
      )}
      <Button label="アップロード" onClick={handleUpload} disabled={!selectedFile || status === 'uploading'} />
    </div>
  );
};

export default UploadForm;
