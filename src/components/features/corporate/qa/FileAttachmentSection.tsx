// src/components/features/corporate/qa/FileAttachmentSection.tsx
import React from 'react';
import Button from '@/components/ui/Button';
import { FileAttachmentSectionProps} from '@/types';



const FileAttachmentSection: React.FC<FileAttachmentSectionProps> = ({
  attachedFiles,
  onAddFile,
  onRemoveFile,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAddFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">添付ファイル</label>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      {attachedFiles.length > 0 && (
        <ul className="list-disc pl-5">
          {attachedFiles.map(file => (
            <li key={file.fileId} className="flex items-center justify-between">
              <span>{file.fileName}</span>
              <Button label="削除" onClick={() => onRemoveFile(file.fileId)} variant="destructive" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileAttachmentSection;
