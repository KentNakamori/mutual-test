// src/components/features/corporate/dashboard/DashboardGraphs.tsx
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

interface GraphDataItem {
  date: string;
  access: number;
  chatCount: number;
}

interface DashboardGraphsProps {
  graphData: GraphDataItem[];
}

/**
 * DashboardGraphs コンポーネント
 * モックデータを利用して、アクセス数とチャット質問数の推移を折れ線グラフで表示します。
 */
const DashboardGraphs: React.FC<DashboardGraphsProps> = ({ graphData }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">アクセス・チャット質問数推移</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="access"
            name="アクセス数"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="chatCount"
            name="チャット質問数"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardGraphs;
