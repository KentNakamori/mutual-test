// components/ui/Card.tsx
import{ CardProps} from '@/types';


/**
 * Card コンポーネント
 * 情報をまとまりとして表示するためのコンテナです。
 */
const Card: React.FC<CardProps> = ({ title, children, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow duration-200 ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
