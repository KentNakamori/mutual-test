import React from 'react';

interface AiGenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  tooltip: string;
  className?: string;
}

const AiGenerateButton: React.FC<AiGenerateButtonProps> = ({
  onClick,
  disabled,
  isLoading,
  tooltip,
  className = ""
}) => {
  return (
    <div className={`flex justify-start ${className}`}>
      <div className="relative group">
        <button
          onClick={onClick}
          disabled={disabled || isLoading}
          className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
            disabled || isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#1CB5E0] to-[#9967EE] text-white hover:opacity-90'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              AIで回答を生成中...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AIで回答を生成
            </>
          )}
        </button>
        {tooltip && disabled && !isLoading && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 text-xs text-white bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-pre-line text-center z-50 min-w-72 max-w-sm">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiGenerateButton; 