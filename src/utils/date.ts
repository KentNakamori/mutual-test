// src/utils/date.ts

export const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    
    // 日本語ロケールで日付をフォーマット
    return d.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // 日付のみのフォーマット（時間なし）
  export const formatDateOnly = (date: string | Date): string => {
    const d = new Date(date);
    
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };
  
  // 時間のみのフォーマット
  export const formatTime = (date: string | Date): string => {
    const d = new Date(date);
    
    return d.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };