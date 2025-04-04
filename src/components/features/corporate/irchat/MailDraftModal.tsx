// src/components/features/corporate/irchat/MailDraftModal.tsx
import React, { useState } from 'react';
import Dialog from '../../../ui/Dialog';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import Textarea from '../../../ui/Textarea';
import { MailDraftModalProps } from "@/types"; 


/**
 * MailDraftModal コンポーネント
 * メールドラフト生成用のモーダル。宛名や質問内容を入力して、AI生成のひな形を取得します。
 */
const MailDraftModal: React.FC<MailDraftModalProps> = ({ isOpen, onClose }) => {
  const [recipientName, setRecipientName] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [mailBody, setMailBody] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // ここでAI生成APIを呼び出す。今回はモック実装
    setTimeout(() => {
      setMailBody(`【自動生成メール】\n宛先: ${recipientName}\n本文: ${questionContent} に基づく回答...`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    if (mailBody) {
      navigator.clipboard.writeText(mailBody);
      alert('メール文をコピーしました。');
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="メールドラフト作成">
      <div className="space-y-4">
        <Input value={recipientName} onChange={setRecipientName} placeholder="宛先名" />
        <Textarea value={questionContent} onChange={setQuestionContent} placeholder="元の質問内容" />
        <div className="flex space-x-2">
          <Button label={isGenerating ? "生成中..." : "生成"} onClick={handleGenerate} disabled={isGenerating} />
          {mailBody && <Button label="コピー" variant="outline" onClick={handleCopy} />}
        </div>
        {mailBody && (
          <div className="p-2 border border-gray-300 rounded bg-gray-50">
            <pre className="text-sm whitespace-pre-wrap">{mailBody}</pre>
          </div>
        )}
      </div>
      
    </Dialog>
  );
};

export default MailDraftModal;
