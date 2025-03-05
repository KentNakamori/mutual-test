// src/components/features/dashboard/DashboardGraphs.tsx
import React from "react";

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
 * 時系列データのグラフを表示します。ここでは簡易的にテーブル表示を実装していますが、
 * 実際のグラフライブラリ（Chart.js, Recharts など）と組み合わせてもよいです。
 */
const DashboardGraphs: React.FC<DashboardGraphsProps> = ({ graphData }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">アクセス・チャット質問数推移</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-2 py-1 border-b">日付</th>
              <th className="px-2 py-1 border-b">アクセス数</th>
              <th className="px-2 py-1 border-b">チャット質問数</th>
            </tr>
          </thead>
          <tbody>
            {graphData.map((item, index) => (
              <tr key={index}>
                <td className="px-2 py-1 border-b">{item.date}</td>
                <td className="px-2 py-1 border-b">{item.access}</td>
                <td className="px-2 py-1 border-b">{item.chatCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-2">※ グラフは実装例としてテーブル表示しています。</p>
    </div>
  );
};

export default DashboardGraphs;
