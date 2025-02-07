'use client'

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';
import BaseWidget from './BaseWidget';
import type { InvestorDTO } from '../../../types/dto';

interface RegistrationData {
  date: string;
  count: number;
}

const InvestorRegistrationWidget: React.FC = () => {
  const [totalInvestors, setTotalInvestors] = useState(0);
  const [recentRegistrations, setRecentRegistrations] = useState<RegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRegistrationData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/investors');
      const data = await response.json();
      
      setTotalInvestors(data.meta.total);

      // 最近7日間の登録数を集計
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const dailyCounts = last7Days.map(date => ({
        date,
        count: data.data.filter((investor: InvestorDTO) => 
          investor.basicInfo.registrationDate?.startsWith(date)
        ).length
      }));

      setRecentRegistrations(dailyCounts);
    } catch (error) {
      console.error('Failed to fetch investor registration data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrationData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <BaseWidget
      title="投資家登録状況"
      onRefresh={fetchRegistrationData}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">登録投資家数</p>
            <p className="text-2xl font-semibold">
              {totalInvestors.toLocaleString()}
              <span className="text-sm font-normal text-gray-500 ml-1">
                名
              </span>
            </p>
          </div>
        </div>

        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recentRegistrations}>
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#94A3B8"
                fontSize={12}
              />
              <YAxis
                width={30}
                stroke="#94A3B8"
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip
                labelFormatter={formatDate}
                contentStyle={{
                  backgroundColor: '#FFF',
                  border: '1px solid #E2E8F0'
                }}
                labelStyle={{ color: '#64748B' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563EB"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </BaseWidget>
  );
};

export default InvestorRegistrationWidget;