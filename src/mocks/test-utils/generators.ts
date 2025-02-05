//src/mocks/test-utils/generators.ts
import type { PaginationParams, FilterParams } from '../../types/api';
import { factories } from './factories';

export const generators = {
  /**
   * 投資家データセットの生成
   */
  createInvestorDataset(count: number = 10) {
    return Array.from({ length: count }).map(() => factories.investor());
  },

  /**
   * ミーティングデータセットの生成
   */
  createMeetingDataset(investorId: ObjectId, count: number = 3) {
    return Array.from({ length: count }).map(() => factories.meeting(investorId));
  },

  /**
   * Q&Aデータセットの生成
   */
  createQADataset(investorId: ObjectId, meetingId: ObjectId, count: number = 5) {
    return Array.from({ length: count }).map(() => factories.qa(investorId, meetingId));
  },

  /**
   * ページネーションパラメータの生成
   */
  createPaginationParams(overrides: Partial<PaginationParams> = {}): PaginationParams {
    return {
      page: 1,
      limit: 10,
      ...overrides
    };
  },

  /**
   * フィルターパラメータの生成
   */
  createFilterParams(overrides: Partial<FilterParams> = {}): FilterParams {
    return {
      status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
      priority: faker.helpers.arrayElement(['high', 'medium', 'low']),
      startDate: faker.date.past().toISOString(),
      endDate: faker.date.future().toISOString(),
      ...overrides
    };
  },

  /**
   * WebSocketメッセージの生成
   */
  createWSMessage(type: string, payload: any = {}) {
    return {
      type,
      payload,
      timestamp: Date.now()
    };
  }
};
