// src/components/features/corporate/qa/UploadButton.tsx
import React from 'react';
import Button from '@/components/ui/Button';

export interface UploadButtonProps {
  onClick: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onClick }) => {
  return <Button label="資料をアップロード" onClick={onClick} variant="gradient" />;
};

export default UploadButton;
