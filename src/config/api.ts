import axios, { AxiosInstance, AxiosError } from 'axios';
import { UserDTO, InvestorDTO, MeetingDTO } from '../types/dto';
import { PaginationParams, FilterParams, APIResponse, APIError } from '../types/api';
import { GridLayoutProps } from '../types/components';
import { Widget } from '../types/models';

export class APIClient {
  private client: AxiosInstance;
  private static instance: APIClient;

  private constructor() {
    this.client = axios.create({
      baseURL: '/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.request.use(
      (config) => {
        if (config && config.headers) {
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
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

  private handleError = (error: AxiosError<APIError>) => {
    if (error.response) {
      const { data, status } = error.response;
      switch (status) {
        case 401:
          return this.refreshToken().then(() => {
            const config = error.config;
            if (!config) {
              return Promise.reject(error);
            }
            return this.client.request(config);
          });
        case 403:
          throw new Error('権限がありません');
        case 404:
          throw new Error('リソースが見つかりません');
        case 422:
          throw new Error(data.message || '入力値が不正です');
        default:
          throw new Error('予期せぬエラーが発生しました');
      }
    }
    throw error;
  };

  private async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/api/v1/auth/refresh', { refreshToken });
      localStorage.setItem('accessToken', response.data.accessToken);
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  // 基本的なHTTPメソッド
  public async get<T>(endpoint: string, config?: any): Promise<T> {
    const response = await this.client.get(endpoint, config);
    return response.data;
  }

  public async post<T>(endpoint: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post(endpoint, data, config);
    return response.data;
  }

  public async put<T>(endpoint: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put(endpoint, data, config);
    return response.data;
  }

  public async delete<T>(endpoint: string, config?: any): Promise<T> {
    const response = await this.client.delete(endpoint, config);
    return response.data;
  }

  // Dashboard API
  public async getWidgets(): Promise<APIResponse<Widget[]>> {
    return this.get('/dashboard/widgets');
  }

  public async updateLayout(layout: GridLayoutProps['layout']): Promise<void> {
    return this.put('/dashboard/layout', { layout });
  }

  // Investors API
  public async getInvestors(
    params: FilterParams & PaginationParams
  ): Promise<APIResponse<InvestorDTO[]>> {
    return this.get('/investors', { params });
  }

  public async getInvestor(id: string): Promise<APIResponse<InvestorDTO>> {
    return this.get(`/investors/${id}`);
  }

  // Meetings API
  public async getMeetings(
    params: FilterParams & PaginationParams
  ): Promise<APIResponse<MeetingDTO[]>> {
    return this.get('/meetings', { params });
  }

  public async createMeeting(meeting: Omit<MeetingDTO, 'id'>): Promise<APIResponse<MeetingDTO>> {
    return this.post('/meetings', meeting);
  }

  // QA API
  public async getQAs(
    params: FilterParams & PaginationParams
  ): Promise<APIResponse<any[]>> {
    return this.get('/qa', { params });
  }

  public async createResponse(qaId: string, response: { content: string }): Promise<void> {
    return this.post(`/qa/${qaId}/responses`, response);
  }

  // Chat API
  public async getChatMessages(
    roomId: string,
    params: PaginationParams
  ): Promise<APIResponse<any[]>> {
    return this.get(`/chat/rooms/${roomId}/messages`, { params });
  }

  public createWebSocketConnection(roomId: string): WebSocket {
    const token = localStorage.getItem('accessToken');
    return new WebSocket(`/api/v1/ws/chat/${roomId}?token=${token}`);
  }

  // Board API
  public async getPosts(
    params: FilterParams & PaginationParams
  ): Promise<APIResponse<any[]>> {
    return this.get('/board/posts', { params });
  }

  public async searchPosts(
    query: string,
    params: PaginationParams
  ): Promise<APIResponse<any[]>> {
    return this.post('/board/posts/search', { query, ...params });
  }
}

export const api = APIClient.getInstance();

export const validators = {
  required: (value: any): boolean => {
    return value !== undefined && value !== null && value !== '';
  },
  minLength: (min: number) => (value: string): boolean => {
    return value.length >= min;
  },
  maxLength: (max: number) => (value: string): boolean => {
    return value.length <= max;
  },
  pattern: (regex: RegExp) => (value: string): boolean => {
    return regex.test(value);
  },
  email: (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
  numberRange: (min: number, max: number) => (value: number): boolean => {
    return value >= min && value <= max;
  }
};

export const RATE_LIMITS = {
  DEFAULT: '100/minute',
  STRICT: '30/minute',
  WEBSOCKET: '60/minute'
} as const;

export const CACHE_STRATEGY = {
  SHORT: 'max-age=60',
  MEDIUM: 'max-age=300',
  LONG: 'max-age=3600',
  STALE: 'stale-while-revalidate=300',
  NONE: 'no-store'
} as const;