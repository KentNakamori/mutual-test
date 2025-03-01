/**
 * Tabsコンポーネント
 * - shadcnのTabsをラップし、プロジェクト固有のバリアントやPropsなどを付与
 */

import React from "react";
import {
  Tabs as ShadcnTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/shadcn/tabs"; 
// ↑ 実際のshadcn Tabs実装へのパスを調整してください

type TabItem = {
  /** タブのユニークなキー */
  key: string;
  /** タブの表示ラベル */
  label: string;
  /** タブに表示するコンテンツ */
  content: React.ReactNode;
};

export type CustomTabsProps = {
  /** 複数のタブ項目 */
  items: TabItem[];
  /** 初期表示タブ(key) */
  defaultValue?: string;
  /** タブ切り替え時のコールバック */
  onTabChange?: (key: string) => void;
};

const Tabs: React.FC<CustomTabsProps> = ({
  items,
  defaultValue,
  onTabChange,
}) => {
  return (
    <ShadcnTabs
      defaultValue={defaultValue || (items[0]?.key ?? "")}
      onValueChange={(val) => {
        if (onTabChange) onTabChange(val);
      }}
      className="w-full"
    >
      <TabsList>
        {items.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((tab) => (
        <TabsContent key={tab.key} value={tab.key}>
          {tab.content}
        </TabsContent>
      ))}
    </ShadcnTabs>
  );
};

export default Tabs;
