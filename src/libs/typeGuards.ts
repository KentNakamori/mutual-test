//src/libs/typeGuards.ts

import type { APIResponse, APIError } from '../types/api';
import type { User, Investor, Meeting, QA, InvestorBasicInfo } from '../types/models';
import type { BaseModel, ObjectId } from '../types/base';

export const typeGuards = {
  /**
   * Error型の判定
   */
  isError(value: any): value is Error {
    return value instanceof Error;
  },

  /**
   * APIError型の判定
   */
  isAPIError(value: any): value is APIError {
    return (
      typeof value === 'object' &&
      value !== null &&
      'code' in value &&
      'message' in value
    );
  },

  /**
   * APIResponse<T>型の判定
   */
  isAPIResponse<T>(value: any): value is APIResponse<T> {
    return (
      typeof value === 'object' &&
      value !== null &&
      'data' in value &&
      (!('meta' in value) || typeof value.meta === 'object')
    );
  },

  /**
   * InvestorBasicInfo型の判定
   */
  isInvestorBasicInfo(value: any): value is InvestorBasicInfo {
    return (
      typeof value === 'object' &&
      value !== null &&
      'name' in value &&
      typeof value.name === 'string' &&
      'company' in value &&
      typeof value.company === 'string' &&
      'email' in value &&
      typeof value.email === 'string'
    );
  },

  /**
   * BaseModel型の判定
   */
  isBaseModel(value: any): value is BaseModel {
    return (
      typeof value === 'object' &&
      value !== null &&
      '_id' in value &&
      typeof value._id === 'string' &&
      (!('created_at' in value) || value.created_at instanceof Date) &&
      (!('updated_at' in value) || value.updated_at instanceof Date)
    );
  },

  /**
   * User型の判定
   */
  isUser(value: any): value is User {
    return (
      this.isBaseModel(value) &&
      'name' in value &&
      typeof value.name === 'string' &&
      'role' in value &&
      (value.role === 'admin' || value.role === 'user' || value.role === 'manager') &&
      'settings' in value &&
      typeof value.settings === 'object'
    );
  },

  /**
   * Investor型の判定
   */
  isInvestor(value: any): value is Investor {
    return (
      this.isBaseModel(value) &&
      'basicInfo' in value &&
      this.isInvestorBasicInfo(value.basicInfo) &&
      'preferences' in value &&
      typeof value.preferences === 'object' &&
      'documents' in value &&
      Array.isArray(value.documents) &&
      'totalUsers' in value &&
      typeof value.totalUsers === 'number' &&
      'status' in value &&
      (value.status === 'active' || value.status === 'inactive' || value.status === 'pending') &&
      'meetings' in value &&
      Array.isArray(value.meetings) &&
      'qas' in value &&
      Array.isArray(value.qas)
    );
  },

  /**
   * Meeting型の判定
   */
  isMeeting(value: any): value is Meeting {
    return (
      this.isBaseModel(value) &&
      'date' in value &&
      value.date instanceof Date &&
      'status' in value &&
      typeof value.status === 'string' &&
      'notes' in value &&
      typeof value.notes === 'string' &&
      'investor_id' in value &&
      typeof value.investor_id === 'string' &&
      'qas' in value &&
      Array.isArray(value.qas) &&
      value.qas.every((qa: any) => typeof qa === 'string')
    );
  },

  /**
   * QA型の判定
   */
  isQA(value: any): value is QA {
    return (
      this.isBaseModel(value) &&
      'status' in value &&
      typeof value.status === 'string' &&
      'priority' in value &&
      typeof value.priority === 'string' &&
      'responses' in value &&
      Array.isArray(value.responses) &&
      value.responses.every((response: any) => 
        typeof response === 'object' &&
        response !== null &&
        'content' in response &&
        typeof response.content === 'string' &&
        'user_id' in response &&
        typeof response.user_id === 'string' &&
        'timestamp' in response &&
        response.timestamp instanceof Date
      ) &&
      'attachments' in value &&
      Array.isArray(value.attachments) &&
      value.attachments.every((attachment: any) =>
        typeof attachment === 'object' &&
        attachment !== null &&
        'name' in attachment &&
        typeof attachment.name === 'string' &&
        'url' in attachment &&
        typeof attachment.url === 'string' &&
        'type' in attachment &&
        typeof attachment.type === 'string'
      ) &&
      'investor_id' in value &&
      typeof value.investor_id === 'string' &&
      'meeting_id' in value &&
      typeof value.meeting_id === 'string'
    );
  },

  /**
   * ObjectId型の判定
   */
  isObjectId(value: any): value is ObjectId {
    return typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value);
  }
};