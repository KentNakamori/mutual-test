// src/mocks/utils/index.ts
import type { APIResponse, APIError } from '../../types/api';

export function createErrorResponse(
  code: number,
  message: string,
  details?: Record<string, any>
): APIError {
  return {
    code,
    message,
    details
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number
): APIResponse<T[]> {
  const start = (page - 1) * limit;
  const paginatedData = data.slice(start, start + limit);

  return {
    data: paginatedData,
    meta: {
      total: data.length,
      page,
      limit
    }
  };
}

export function simulateNetworkDelay(): Promise<void> {
  const delay = Math.random() * 1000 + 500; // 500ms - 1500ms
  return new Promise(resolve => setTimeout(resolve, delay));
}