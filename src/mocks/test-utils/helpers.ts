// src/mocks/test-utils/helpers.ts
import type { APIResponse } from '../../types/api';

export const testHelpers = {
  /**
   * API レスポンスの生成
   */
  createAPIResponse<T>(data: T, meta?: APIResponse<T>['meta']): APIResponse<T> {
    return { data, meta };
  },

  /**
   * 認証トークンの生成
   */
  generateAuthTokens() {
    return {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token'
    };
  },

  /**
   * テスト用のローカルストレージセットアップ
   */
  setupLocalStorage(data: Record<string, string> = {}) {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  },

  /**
   * テスト用のローカルストレージクリーンアップ
   */
  cleanupLocalStorage() {
    localStorage.clear();
  },

  /**
   * モックレスポンスの待機
   */
  async waitForResponse(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * WebSocket接続のモック
   */
  mockWebSocket() {
    const mockWS = {
      send: jest.fn(),
      close: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };
    
    // @ts-ignore - WebSocketをグローバルにモック
    global.WebSocket = jest.fn(() => mockWS);
    
    return mockWS;
  }
};