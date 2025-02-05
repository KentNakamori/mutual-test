// src/types/models.ts
import { BaseModel, ObjectId } from './base';

export interface User extends BaseModel {
  name: string;
  email: string;        // この行を追加
  password: string;     // この行も必要です（認証用）
  role: UserRole;
  settings: Record<string, any>;
}

export type UserRole = 'admin' | 'user' | 'manager';

export interface Widget extends BaseModel {
  type: string;
  settings: Record<string, any>;
  layout: WidgetLayout;
  refreshInterval: number;
}

export interface WidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Investor extends BaseModel {
  basicInfo: InvestorBasicInfo;
  preferences: Record<string, any>;
  documents: InvestorDocument[];
  totalUsers: number;
  status: InvestorStatus;
  meetings: ObjectId[];
  qas: ObjectId[];
}

export interface InvestorBasicInfo {
  name: string;
  company: string;
  email: string;
}

export interface InvestorDocument {
  title: string;
  url: string;
  type: string;
}

export type InvestorStatus = 'active' | 'inactive' | 'pending';

export interface Meeting extends BaseModel {
  date: Date;
  status: string;
  notes: string;
  investor_id: ObjectId;
  qas: ObjectId[];
}

export interface QA extends BaseModel {
  status: string;
  priority: string;
  responses: QAResponse[];
  attachments: QAAttachment[];
  investor_id: ObjectId;
  meeting_id: ObjectId;
}

export interface QAResponse {
  content: string;
  user_id: ObjectId;
  timestamp: Date;
}

export interface QAAttachment {
  name: string;
  url: string;
  type: string;
}