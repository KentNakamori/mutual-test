"use client";

import { useEffect } from 'react';
import { loadPrismComponents } from '@/lib/prism';

/**
 * PrismJSを早期に初期化するコンポーネント
 * アプリケーションの起動時に一度だけ実行される
 */
const PrismLoader: React.FC = () => {
  useEffect(() => {
    // アプリケーション起動時にPrismJSを初期化
    loadPrismComponents().catch(error => {
      console.warn('PrismJSの初期化に失敗しました:', error);
    });
  }, []);

  // このコンポーネントは何もレンダリングしない
  return null;
};

export default PrismLoader; 