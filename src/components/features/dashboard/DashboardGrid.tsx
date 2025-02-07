"use client";

import React, { useState, useEffect } from 'react';
import AppointmentWidget from './AppointmentWidget';
import QAStatusWidget from './QAStatusWidget';
import InvestorRegistrationWidget from './InvestorRegistrationWidget';
import NotificationWidget from './NotificationWidget';

interface GridLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const DashboardGrid: React.FC = () => {
  const [layout, setLayout] = useState<GridLayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLayout = async () => {
    try {
      const response = await fetch('/api/dashboard/layout');
      const data = await response.json();
      
      if (data.success && data.layout) {
        setLayout(data.layout);
      } else {
        // デフォルトレイアウト
        setLayout([
          { i: 'appointments', x: 0, y: 0, w: 1, h: 1 },
          { i: 'qa-status', x: 1, y: 0, w: 1, h: 1 },
          { i: 'investor-registration', x: 2, y: 0, w: 1, h: 1 },
          { i: 'notifications', x: 3, y: 0, w: 1, h: 1 }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch layout:', error);
      // エラー時もデフォルトレイアウトを設定
      setLayout([
        { i: 'appointments', x: 0, y: 0, w: 1, h: 1 },
        { i: 'qa-status', x: 1, y: 0, w: 1, h: 1 },
        { i: 'investor-registration', x: 2, y: 0, w: 1, h: 1 },
        { i: 'notifications', x: 3, y: 0, w: 1, h: 1 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLayout();
  }, []);

  const onLayoutChange = async (newLayout: GridLayout[]) => {
    try {
      const response = await fetch('/api/dashboard/layout', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ layout: newLayout })
      });

      const data = await response.json();
      if (data.success) {
        setLayout(newLayout);
      }
    } catch (error) {
      console.error('Failed to update layout:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <AppointmentWidget />
      <QAStatusWidget />
      <InvestorRegistrationWidget />
      <NotificationWidget />
    </div>
  );
};

export default DashboardGrid;
