//src\components\features\investor\company\ChatInputBox.tsx

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { ChatInputBoxProps } from '../../../../types';



/**
 * ChatInputBox コンポーネント
 * ユーザーがメッセージを入力し送信できる入力欄と送信ボタンを提供します。
 */
const ChatInputBox: React.FC<ChatInputBoxProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState<string>("");
  
  const handleSend = () => {
    if (inputValue.trim() === "") return;
    onSendMessage(inputValue);
    setInputValue("");
  };
  
  return (
    <div className="flex space-x-2">
      <Textarea
        value={inputValue}
        onChange={setInputValue}
        placeholder="メッセージを入力..."
      />
      <Button label="送信" onClick={handleSend} />
    </div>
  );
};

export default ChatInputBox;
