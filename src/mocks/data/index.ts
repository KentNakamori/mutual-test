// src/mocks/data/index.ts
import { faker } from '@faker-js/faker';
import type { User, Investor, Meeting, QA, Widget } from '../../types/models';
import type { ObjectId } from '../../types/base';

export const mockDataGenerators = {
  /**
   * サンプルユーザーデータの生成
   */
  generateUsers(count: number = 10): User[] {
    return Array.from({ length: count }).map(() => ({
      _id: faker.string.uuid() as ObjectId,
      name: faker.person.fullName(),
      role: faker.helpers.arrayElement(['admin', 'user', 'manager']),
      settings: {
        theme: faker.helpers.arrayElement(['light', 'dark']),
        notifications: faker.datatype.boolean(),
        language: faker.helpers.arrayElement(['ja', 'en'])
      },
      created_at: faker.date.past(),
      updated_at: faker.date.recent()
    }));
  },

  /**
   * サンプル投資家データの生成
   */
  generateInvestors(count: number = 20): Investor[] {
    return Array.from({ length: count }).map(() => ({
      _id: faker.string.uuid() as ObjectId,
      basicInfo: {
        name: faker.person.fullName(),
        company: faker.company.name(),
        email: faker.internet.email()
      },
      preferences: {
        investmentSize: faker.helpers.arrayElement(['小規模', '中規模', '大規模']),
        sector: faker.helpers.arrayElement(['IT', 'バイオ', '金融', '不動産']),
        stage: faker.helpers.arrayElement(['シード', 'アーリー', 'ミドル', 'レイト'])
      },
      documents: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => ({
        title: `${faker.word.sample()} ${faker.word.sample()}`,
        url: faker.internet.url(),
        type: faker.helpers.arrayElement(['pdf', 'doc', 'xlsx'])
      })),
      totalUsers: faker.number.int({ min: 100, max: 10000 }),
      status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
      meetings: [],
      qas: [],
      created_at: faker.date.past(),
      updated_at: faker.date.recent()
    }));
  },

  /**
   * サンプルミーティングデータの生成
   */
  generateMeetings(investorIds: ObjectId[], count: number = 30): Meeting[] {
    return Array.from({ length: count }).map(() => ({
      _id: faker.string.uuid() as ObjectId,
      date: faker.date.future(),
      status: faker.helpers.arrayElement(['scheduled', 'completed', 'cancelled']),
      notes: faker.lorem.paragraphs(2),
      investor_id: faker.helpers.arrayElement(investorIds),
      qas: [],
      created_at: faker.date.past(),
      updated_at: faker.date.recent()
    }));
  },

  /**
   * サンプルQ&Aデータの生成
   */
  generateQAs(meetings: Meeting[], count: number = 50): QA[] {
    return Array.from({ length: count }).map(() => {
      const meeting = faker.helpers.arrayElement(meetings);
      return {
        _id: faker.string.uuid() as ObjectId,
        status: faker.helpers.arrayElement(['pending', 'answered', 'closed']),
        priority: faker.helpers.arrayElement(['high', 'medium', 'low']),
        responses: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => ({
          content: faker.lorem.paragraph(),
          user_id: faker.string.uuid() as ObjectId,
          timestamp: faker.date.recent()
        })),
        attachments: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }).map(() => ({
          name: `${faker.system.fileName()}.${faker.system.fileExt()}`,
          url: faker.internet.url(),
          type: faker.helpers.arrayElement(['image', 'document', 'spreadsheet'])
        })),
        investor_id: meeting.investor_id,
        meeting_id: meeting._id,
        created_at: faker.date.past(),
        updated_at: faker.date.recent()
      };
    });
  },

  /**
   * サンプルウィジェットデータの生成
   */
  generateWidgets(count: number = 8): Widget[] {
    return Array.from({ length: count }).map(() => ({
      _id: faker.string.uuid() as ObjectId,
      type: faker.helpers.arrayElement(['chart', 'table', 'metrics', 'calendar']),
      settings: {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        dataSource: faker.helpers.arrayElement(['investors', 'meetings', 'qas']),
        refreshInterval: faker.number.int({ min: 30, max: 300 })
      },
      layout: {
        x: faker.number.int({ min: 0, max: 10 }),
        y: faker.number.int({ min: 0, max: 10 }),
        w: faker.number.int({ min: 1, max: 4 }),
        h: faker.number.int({ min: 1, max: 4 })
      },
      refreshInterval: faker.number.int({ min: 30, max: 300 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent()
    }));
  }
};

// データベースの初期化関数
export const initializeMockData = () => {
  const users = mockDataGenerators.generateUsers();
  const investors = mockDataGenerators.generateInvestors();
  const meetings = mockDataGenerators.generateMeetings(
    investors.map(i => i._id)
  );
  const qas = mockDataGenerators.generateQAs(meetings);
  const widgets = mockDataGenerators.generateWidgets();

  return {
    users,
    investors,
    meetings,
    qas,
    widgets
  };
};