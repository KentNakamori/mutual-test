"use client";

import React from 'react';
import Dialog from '@/components/ui/Dialog';
import { X, ExternalLink, Download } from 'lucide-react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  pdfUrl: string;
}

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  isOpen,
  onClose,
  fileName,
  pdfUrl,
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] mx-4 flex flex-col">
          {/* ヘッダー */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex-1">
              <h2 className="text-lg font-semibold truncate">{fileName}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="ダウンロード"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={handleOpenInNewTab}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="新しいタブで開く"
              >
                <ExternalLink className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* PDFビューア */}
          <div className="flex-1 p-4">
            <iframe
              src={pdfUrl}
              className="w-full h-full border rounded-lg"
              title={fileName}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}; 