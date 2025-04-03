// src/components/features/corporate/qa/UploadButton.tsx
import React from 'react';
import Button from '@/components/ui/Button';
import { UploadButtonProps} from '@/types';


const UploadButton: React.FC<UploadButtonProps> = ({ onClick }) => {
  return <Button label="資料をアップロード" onClick={onClick} variant="gradient" />;
};

export default UploadButton;
