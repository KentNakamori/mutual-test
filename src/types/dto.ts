// src/types/dto.ts
import type { User, Investor, Meeting, QA } from './models';
import type { ObjectId } from './base';

export type BaseDTO<T> = Omit<T, '_id'> & {
  id: string;
};

export type UserDTO = BaseDTO<User>;

export type InvestorDTO = BaseDTO<Omit<Investor, 'meetings' | 'qas'>> & {
  meetings: string[];
  qas: string[];
};

export type MeetingDTO = BaseDTO<Omit<Meeting, 'investor_id' | 'qas'>> & {
  investor_id: string;
  qas: string[];
};

export type QADTO = BaseDTO<QA>;