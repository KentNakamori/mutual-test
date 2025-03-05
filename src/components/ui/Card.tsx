// components/ui/Card.tsx
import React from 'react';

export interface CardProps {
  /** カードのタイトル（任意） */
  title?: string;
  /** カード内に表示するコンテンツ */
  children: React.ReactNode;
  /** クリック時のハンドラ（オプション） */
  onClick?: () => void;
  /** 追加のクラス名（必要に応じてカスタマイズ） */
  className?: string;
}

/**
 * Card コンポーネント
 * 情報をまとまりとして表示するためのコンテナです。
 */
const Card: React.FC<CardProps> = ({ title, children, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white shadow-md rounded p-4 hover:shadow-lg transition-shadow duration-200 ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
