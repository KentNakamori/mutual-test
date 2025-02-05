// src/types/api.ts
export interface PaginationParams {
    page: number;
    limit: number;
  }
  
  export interface FilterParams {
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
  }
  
  export interface APIResponse<T> {
    data: T;
    meta?: {
      total: number;
      page: number;
      limit: number;
    };
  }
  
  export interface APIError {
    code: number;
    message: string;
    details?: Record<string, any>;
  }
  