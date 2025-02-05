//src\hooks\useApi.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { APIClient } from '../config/api';
import type { PaginationParams, FilterParams, APIResponse } from '../types/api';
import type { WebSocketHookOptions, WSMessage } from '../types/components';
import type { QueryOptions } from '../types/utils';

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export function useQuery<T>(
  endpoint: string,
  params?: FilterParams & PaginationParams,
  options?: QueryOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await APIClient.getInstance().get<APIResponse<T>>(endpoint, { params });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('不明なエラーが発生しました'));
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useMutation<T, U>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (data?: U): Promise<T | null> => {
    try {
      setLoading(true);
      const apiClient = APIClient.getInstance();
      let response: APIResponse<T>;
      
      switch (method) {
        case 'POST':
          response = await apiClient.post<APIResponse<T>>(endpoint, data);
          break;
        case 'PUT':
          response = await apiClient.put<APIResponse<T>>(endpoint, data);
          break;
        case 'DELETE':
          response = await apiClient.delete<APIResponse<T>>(endpoint);
          break;
        default:
          throw new Error('不正なHTTPメソッドです');
      }
      
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('更新中にエラーが発生しました'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useWebSocket(options: WebSocketHookOptions) {
  const { url, onMessage, onError, reconnectAttempts = 3, reconnectInterval = 5000 } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);

  const connect = useCallback(() => {
    const ws = APIClient.getInstance().createWebSocketConnection(url);

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as WSMessage;
        onMessage(data);
      } catch (err) {
        onError(err instanceof Error ? err : new Error('メッセージエラー'));
      }
    };

    ws.onerror = () => onError(new Error('接続エラー'));
    ws.onclose = () => {
      if (attemptsRef.current < reconnectAttempts) {
        setTimeout(() => {
          attemptsRef.current += 1;
          connect();
        }, reconnectInterval);
      }
    };

    wsRef.current = ws;
  }, [url, onMessage, onError, reconnectAttempts, reconnectInterval]);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  return wsRef.current;
}

export function usePolling<T>(
  endpoint: string,
  interval: number,
  params?: FilterParams & PaginationParams
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await APIClient.getInstance().get<APIResponse<T>>(endpoint, { params });
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('不明なエラーが発生しました'));
      } finally {
        setLoading(false);
        timeoutId = setTimeout(fetchData, interval);
      }
    };

    fetchData();
    return () => clearTimeout(timeoutId);
  }, [endpoint, interval, JSON.stringify(params)]);

  return { data, loading, error };
}