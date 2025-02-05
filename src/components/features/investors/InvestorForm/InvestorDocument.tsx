import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { InvestorDocument } from '@/types/models';

interface InvestorDocumentFormProps {
  documents: InvestorDocument[];
  onChange: (documents: InvestorDocument[]) => void;
  errors?: Record<string, string>;
}

export const InvestorDocumentForm: React.FC<InvestorDocumentFormProps> = ({
  documents,
  onChange,
  errors = {}
}) => {
  const [dragActive, setDragActive] = useState(false);

  // ドラッグ&ドロップハンドラー
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // ファイルドロップハンドラー
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  // ファイル選択ハンドラー
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // ファイル処理
  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      // ファイルサイズチェック (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('ファイルサイズは10MB以下にしてください');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newDocument: InvestorDocument = {
          title: file.name,
          type: file.type,
          url: URL.createObjectURL(file)
        };
        onChange([...documents, newDocument]);
      };
      reader.readAsDataURL(file);
    });
  };

  // ドキュメント削除
  const handleRemoveDocument = (index: number) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    onChange(newDocuments);
  };

  // ドキュメントタイトル更新
  const handleUpdateTitle = (index: number, title: string) => {
    const newDocuments = documents.map((doc, i) => 
      i === index ? { ...doc, title } : doc
    );
    onChange(newDocuments);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold leading-relaxed">関連文書</h2>
        <p className="text-sm text-gray-500">投資家に関連する文書をアップロードしてください</p>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* ドラッグ&ドロップエリア */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              w-full p-8 border-2 border-dashed rounded-lg text-center
              transition-colors duration-200
              ${dragActive 
                ? 'border-black bg-gray-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <div className="space-y-2">
              <div className="text-4xl">📄</div>
              <p className="text-gray-600">
                ドラッグ&ドロップでファイルをアップロード
              </p>
              <p className="text-sm text-gray-500">
                または
              </p>
              <label className="inline-block">
                <span className="px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                  ファイルを選択
                </span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
              </label>
              <p className="text-sm text-gray-500">
                最大10MB、PDF・Word・Excel形式
              </p>
            </div>
          </div>

          {/* アップロード済み文書一覧 */}
          {documents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">アップロード済み文書</h3>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="text-2xl">
                      {doc.type.includes('pdf') ? '📕' : 
                       doc.type.includes('word') ? '📘' : 
                       doc.type.includes('excel') ? '📗' : '📄'}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={doc.title}
                        onChange={(e) => handleUpdateTitle(index, e.target.value)}
                        className="w-full px-2 py-1 text-sm border-b border-transparent hover:border-gray-300 focus:border-black focus:outline-none"
                      />
                      <p className="text-sm text-gray-500">
                        {new URL(doc.url).pathname.split('/').pop()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        👁️
                      </a>
                      <button
                        onClick={() => handleRemoveDocument(index)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.documents && (
            <p className="text-sm text-red-600">{errors.documents}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorDocumentForm;
