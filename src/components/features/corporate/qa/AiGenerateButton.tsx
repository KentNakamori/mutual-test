import React from 'react';
import Button from '@/components/ui/Button';

interface AiGenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  tooltip?: string;
}

const AiGenerateButton: React.FC<AiGenerateButtonProps> = ({ 
  onClick, 
  disabled = false, 
  isLoading = false,
  tooltip 
}) => {
  return (
    <div className="relative">
      <Button 
        label={isLoading ? "生成中..." : "AIで回答を生成"} 
        onClick={onClick} 
        variant="gradient"
        disabled={disabled || isLoading}
        className={disabled ? "opacity-50 cursor-not-allowed" : ""}
      />
      {tooltip && disabled && !isLoading && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-700 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default AiGenerateButton; 