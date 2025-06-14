import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// 型定義ファイルから GraphDataItem および DashboardGraphsProps をインポート
import { DashboardGraphsProps } from "@/types";

/**
 * DashboardGraphs コンポーネント
 * アクセス数とチャット質問数の推移を折れ線グラフで表示します。
 */
const DashboardGraphs: React.FC<DashboardGraphsProps> = ({ graphData }) => {
  // Date型をフォーマットしてグラフ表示用のデータに変換
  const formattedData = graphData.map(item => ({
    ...item,
    date: typeof item.date === 'string' ? item.date : (item.date as Date).toISOString().split('T')[0],
    accessCount: item.access,
    chatCount: item.chatCount
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">アクセス数・チャット質問数推移</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} />
          <XAxis dataKey="date" />
          <YAxis 
            yAxisId="left"
            orientation="left"
            tick={{ fill: '#2e8b57' }}
            axisLine={{ stroke: '#2e8b57' }}
            allowDecimals={false}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#6a5acd' }}
            axisLine={{ stroke: '#6a5acd' }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="accessCount"
            name="アクセス数"
            stroke="#6a5acd"
            strokeWidth={2.5}
            activeDot={{ r: 8 }}
            yAxisId="right"
          />
          <Line
            type="monotone"
            dataKey="chatCount"
            name="チャット質問数"
            stroke="#2e8b57"
            strokeWidth={2.5}
            yAxisId="left"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardGraphs;
