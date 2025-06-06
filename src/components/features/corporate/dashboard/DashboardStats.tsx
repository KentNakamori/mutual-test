// src/components/features/corporate/dashboard/DashboardStats.tsx
import React from "react";
import Card from "@/components/ui/Card";
import { Stat, DashboardStatsProps } from "@/types";

/**
 * DashboardStats コンポーネント
 * 主要な統計情報をカード形式で表示します。
 */
const DashboardStats: React.FC<DashboardStatsProps> = ({ statsData }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="flex flex-col items-center justify-center p-4 text-center">
          <h3 className="text-base font-semibold mb-2">{stat.label}</h3>
          <span className="text-xl font-bold">
            {stat.value} {stat.unit}
          </span>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
