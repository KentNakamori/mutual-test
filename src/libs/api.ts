//src/libs/api.ts

import axios, { AxiosInstance, AxiosError } from 'axios';
import type { APIResponse, APIError, PaginationParams, FilterParams } from '../types/api';
import { CacheStrategy } from '../types/utils';

class APIClient {
  private static instance: APIClient;
  private client: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }>;

  private constructor() {
    this.client = axios.create({
      baseURL: '/api/v1',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    this.cache = new Map();
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      this.handleError
    );
  }

  private handleError = async (error: AxiosError<APIError>) => {
    if (!error.response) throw new Error('ネットワークエラー');

    const { status, data } = error.response;
    switch (status) {
      case 401:
        return this.handleUnauthorized(error);
      case 403:
        throw new Error('権限がありません');
      case 404:
        throw new Error('リソースが見つかりません');
      case 422:
        throw new Error(data.message || '入力値が不正です');
      default:
        throw new Error('予期せぬエラーが発生しました');
    }
  };

  private async handleUnauthorized(error: AxiosError) {
    try {
      await this.refreshToken();
      const config = error.config;
      if (!config) throw new Error('リクエスト設定が見つかりません');
      return this.client.request(config);
    } catch (e) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      throw e;
    }
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('リフレッシュトークンが見つかりません');
    
    const response = await axios.post('/api/v1/auth/refresh', { refreshToken });
    localStorage.setItem('accessToken', response.data.accessToken);
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}${params ? `?${JSON.stringify(params)}` : ''}`;
  }

  private isCacheValid(timestamp: number, staleTime: number): boolean {
    return Date.now() - timestamp < staleTime;
  }

  public async request<T>(
    method: string,
    endpoint: string,
    config: {
      params?: FilterParams & PaginationParams;
      data?: any;
      cache?: CacheStrategy;
      staleTime?: number;
    } = {}
  ): Promise<APIResponse<T>> {
    const cacheKey = this.getCacheKey(endpoint, config.params);
    const cached = this.cache.get(cacheKey);

    if (cached && config.cache && this.isCacheValid(cached.timestamp, config.staleTime || 60000)) {
      return cached.data;
    }

    const response = await this.client.request<APIResponse<T>>({
      method,
      url: endpoint,
      params: config.params,
      data: config.data,
    });

    if (config.cache) {
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response.data;
  }
}

export const api = APIClient.getInstance();