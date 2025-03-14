// components/ui/Dialog.tsx
import React from 'react';

export interface DialogProps {
  /** ダイアログが開いているか */
  isOpen: boolean;
  /** ダイアログを閉じるためのハンドラ */
  onClose: () => void;
  /** ダイアログのタイトル（任意） */
  title?: string;
  /** ダイアログ内に表示するコンテンツ */
  children: React.ReactNode;
}

/**
 * Dialog コンポーネント
 * モーダルダイアログとして情報提示や確認操作を行います。
 */
const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg max-w-lg w-full p-6">
        {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
        <div className="mb-4">{children}</div>
        <button onClick={onClose} className="mt-2 bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
          Close
        </button>
      </div>
    </div>
  );
};

export default Dialog;
