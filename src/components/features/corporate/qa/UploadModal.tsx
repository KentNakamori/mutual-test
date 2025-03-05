// src/components/features/qa/UploadModal.tsx
import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import UploadForm from './UploadForm';
import GeneratedQaList from './GeneratedQaList';
import Button from '@/components/ui/Button';
import { QA } from '@/types';

export interface UploadModalProps {
  onClose: () => void;
  onConfirm: (newQas: QA[]) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onConfirm }) => {
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [generatedQas, setGeneratedQas] = useState<QA[]>([]);

  const handleUploadSuccess = (qas: QA[]) => {
    setGeneratedQas(qas);
    setStep('review');
  };

  const handleConfirmRegistration = () => {
    onConfirm(generatedQas);
  };

  return (
    <Dialog isOpen={true} onClose={onClose} title="資料アップロード">
      {step === 'upload' && (
        <UploadForm onUploadSuccess={handleUploadSuccess} onUploadError={(error) => console.error(error)} />
      )}
      {step === 'review' && (
        <>
          <GeneratedQaList
            qaDrafts={generatedQas}
            onUpdateDraft={(index, updatedQa) => {
              setGeneratedQas(prev => {
                const newList = [...prev];
                newList[index] = updatedQa;
                return newList;
              });
            }}
            onDeleteDraft={(index) => {
              setGeneratedQas(prev => prev.filter((_, idx) => idx !== index));
            }}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button label="戻る" onClick={() => setStep('upload')} variant="outline" />
            <Button label="一括登録" onClick={handleConfirmRegistration} />
          </div>
        </>
      )}
    </Dialog>
  );
};

export default UploadModal;
