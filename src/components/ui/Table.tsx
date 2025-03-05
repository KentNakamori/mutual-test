// components/ui/Table.tsx
import React from 'react';

export interface Column {
  key: string;
  label: string;
  /** ソート可能かどうか（任意） */
  sortable?: boolean;
}

export interface TableProps<T> {
  /** テーブルのカラム定義 */
  columns: Column[];
  /** テーブルのデータ行 */
  data: T[];
  /** ソート時のハンドラ（カラムキーとソート方向） */
  onSort?: (columnKey: string, sortDirection: 'asc' | 'desc') => void;
}

/**
 * Table コンポーネント
 * 表形式でデータを表示し、必要に応じてソート操作を提供します。
 */
function Table<T extends { [key: string]: any }>({
  columns,
  data,
  onSort,
}: TableProps<T>) {
  // 簡易的な実装例。実際にはソート状態の管理が必要な場合、useState等で実装します。
  const handleSort = (columnKey: string) => {
    if (onSort) {
      // 例として常に 'asc' を返す形。実際には状態に基づいたソート方向のトグル処理を実装してください。
      onSort(columnKey, 'asc');
    }
  };

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="border-b border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
            >
              <div className="flex items-center">
                <span>{col.label}</span>
                {col.sortable && (
                  <button onClick={() => handleSort(col.key)} className="ml-1 text-xs text-gray-500 hover:text-black">
                    ▲
                  </button>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-100">
            {columns.map((col) => (
              <td key={col.key} className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
