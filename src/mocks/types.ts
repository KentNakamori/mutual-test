// src/mocks/types.ts
import type { User, Investor, Meeting, QA } from '../types/models'
import type { APIResponse, APIError } from '../types/api'

export interface MockDatabase {
  users: Map<string, User>;
  investors: Map<string, Investor>;
  meetings: Map<string, Meeting>;
  qas: Map<string, QA>;
}

export interface MockDBOperations {
  users: {
    getAll: () => User[];
    findById: (id: string) => User | undefined;
    findByEmail: (email: string) => User | undefined;
    create: (user: Omit<User, '_id'>) => User;
    update: (id: string, data: Partial<User>) => User | undefined;
    delete: (id: string) => boolean;
  };
  investors: {
    getAll: () => Investor[];
    findById: (id: string) => Investor | undefined;
    findByEmail: (email: string) => Investor | undefined;
    create: (investor: Omit<Investor, '_id'>) => Investor;
    update: (id: string, data: Partial<Investor>) => Investor | undefined;
    delete: (id: string) => boolean;
  };
  meetings: {
    getAll: () => Meeting[];
    findById: (id: string) => Meeting | undefined;
    findByInvestorId: (investorId: string) => Meeting[];
    create: (meeting: Omit<Meeting, '_id'>) => Meeting;
    update: (id: string, data: Partial<Meeting>) => Meeting | undefined;
    delete: (id: string) => boolean;
  };
  qas: {
    getAll: () => QA[];
    findById: (id: string) => QA | undefined;
    findByMeetingId: (meetingId: string) => QA[];
    findByInvestorId: (investorId: string) => QA[];
    create: (qa: Omit<QA, '_id'>) => QA;
    update: (id: string, data: Partial<QA>) => QA | undefined;
    delete: (id: string) => boolean;
  };
}

export interface HandlerResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export type ErrorResponse = APIError;

export const createSuccessResponse = <T>(data: T, meta?: HandlerResponse<T>['meta']): APIResponse<T> => ({
  data,
  meta
});

export const createErrorResponse = (code: number, message: string, details?: Record<string, any>): APIError => ({
  code,
  message,
  details
});