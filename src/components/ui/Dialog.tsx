// components/ui/Dialog.tsx
import React from 'react';
import { DialogProps } from '@/types';

/**
 * Dialog コンポーネント
 * モーダルダイアログとして情報提示や確認操作を行います。
 */
const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;

  // 外部から className が指定されなければ、デフォルトで max-w-lg を適用する
  const containerClass = className ? className : 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded shadow-lg w-full p-6 ${containerClass}`}>
        {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
        <div className="mb-4">{children}</div>
        <button
          onClick={onClose}
          className="mt-2 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Dialog;
