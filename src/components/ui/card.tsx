/**
 * Cardコンポーネント
 * - shadcnのCardをラップし、タイトルや説明文、子要素(children)をまとめて表示
 */

import React from "react";
import {
  Card as ShadcnCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/shadcn/card"; 
// ↑ 実際のshadcn Card実装へのパスを調整してください

export type CustomCardProps = {
  /** カードのタイトル */
  title?: string;
  /** カードの説明文 */
  description?: string;
  /** メインコンテンツ */
  children?: React.ReactNode;
  /** Footer部分に配置したい要素 */
  footer?: React.ReactNode;
  /** クリック全体に反応させる場合など */
  onClick?: () => void;
};

const Card: React.FC<CustomCardProps> = ({
  title,
  description,
  children,
  footer,
  onClick,
}) => {
  return (
    <ShadcnCard
      className="hover:shadow-sm transition-shadow cursor-default"
      onClick={onClick}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      {children && <CardContent>{children}</CardContent>}

      {footer && <CardFooter>{footer}</CardFooter>}
    </ShadcnCard>
  );
};

export default Card;
