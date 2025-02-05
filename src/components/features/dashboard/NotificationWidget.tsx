import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import BaseWidget from './BaseWidget';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'error';
  createdAt: string;
}

const NotificationWidget: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // 通知APIのエンドポイントが実装されたら差し替え
      // モックデータを使用
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: '緊急メンテナンス予定',
          content: '明日2:00-4:00にシステムメンテナンスを実施します。',
          type: 'warning',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: '新規Q&A機能リリース',
          content: 'Q&A機能が改善され、添付ファイル機能が追加されました。',
          type: 'info',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getIconStyle = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <BaseWidget
      title="重要通知"
      onRefresh={fetchNotifications}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${getNotificationStyle(
                notification.type
              )}`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={16}
                  className={getIconStyle(notification.type)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">
              新しい通知はありません
            </p>
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

export default NotificationWidget;