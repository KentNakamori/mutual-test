// src/components/features/corporate/qa/UploadModal.tsx
import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import UploadForm from './UploadForm';
import GeneratedQaList from './GeneratedQaList';
import Button from '@/components/ui/Button';
import { QA, UploadModalProps} from '@/types';



const UploadModal: React.FC<UploadModalProps> = ({ onClose, onConfirm }) => {
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [generatedQas, setGeneratedQas] = useState<QA[]>([]);
  
  // 新たに資料種類選択用の state を追加
  const [materialType, setMaterialType] = useState('マニュアル');

  const handleUploadSuccess = (qas: QA[]) => {
    setGeneratedQas(qas);
    setStep('review');
  };

  const handleConfirmRegistration = () => {
    onConfirm(generatedQas);
  };

  return (
    <Dialog isOpen={true} onClose={onClose} title="資料アップロード" className="max-w-4xl">
      {step === 'upload' && (
        <>
          {/* ステップ表示 */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Step 1: ファイルアップロード</h4>
          </div>
          <UploadForm 
            materialType={materialType}
            onMaterialTypeChange={setMaterialType}
            onUploadSuccess={handleUploadSuccess} 
            onUploadError={(error) => console.error(error)} 
          />
        </>
      )}
      {step === 'review' && (
        <>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Step 3: 生成候補のレビュー・一括登録</h4>
          </div>
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
