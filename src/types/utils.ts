// src/types/utils.ts
export enum Role {
    Admin = 'admin',
    User = 'user',
    Manager = 'manager'
  }
  
  export enum Status {
    Active = 'active',
    Inactive = 'inactive',
    Pending = 'pending'
  }
  
  export enum CacheStrategy {
    Short = 'max-age=60',
    Medium = 'max-age=300',
    Long = 'max-age=3600',
    Stale = 'stale-while-revalidate=300',
    None = 'no-store'
  }
  
  export type ValidationRule<T> = (value: T) => boolean | string;
  
  export type ValidationSchema<T> = {
    [K in keyof T]: ValidationRule<T[K]>[];
  };
  
  export interface QueryOptions {
    staleTime?: number;
    cacheTime?: number;
    retry?: number;
  }
  
  export const API_ENDPOINTS = {
    AUTH: '/api/v1/auth',
    DASHBOARD: '/api/v1/dashboard',
    INVESTORS: '/api/v1/investors',
    MEETINGS: '/api/v1/meetings',
    QA: '/api/v1/qa',
    CHAT: '/api/v1/chat',
    BOARD: '/api/v1/board'
  } as const;
  
  export const RATE_LIMITS = {
    DEFAULT: '100/minute',
    STRICT: '30/minute',
    WEBSOCKET: '60/minute'
  } as const;