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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="text-center">
          <h3 className="text-lg font-semibold">{stat.label}</h3>
          <p className="text-2xl font-bold">
            {stat.value} {stat.unit}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
