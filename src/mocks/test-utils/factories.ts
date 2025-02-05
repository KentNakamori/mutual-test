// src/mocks/test-utils/factories.ts
import { faker } from '@faker-js/faker';
import type {
  User,
  Investor,
  Meeting,
  QA,
  Widget,
  InvestorBasicInfo
} from '../../types/models';
import type { ObjectId } from '../../types/base';

export const factories = {
  user: (overrides: Partial<User> = {}): User => ({
    _id: faker.string.uuid() as ObjectId,
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(['admin', 'user', 'manager']),
    settings: {},
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    ...overrides
  }),

  investorBasicInfo: (overrides: Partial<InvestorBasicInfo> = {}): InvestorBasicInfo => ({
    name: faker.person.fullName(),
    company: faker.company.name(),
    email: faker.internet.email(),
    ...overrides
  }),

  investor: (overrides: Partial<Investor> = {}): Investor => ({
    _id: faker.string.uuid() as ObjectId,
    basicInfo: factories.investorBasicInfo(),
    preferences: {},
    documents: [],
    totalUsers: faker.number.int({ min: 100, max: 10000 }),
    status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
    meetings: [],
    qas: [],
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    ...overrides
  }),

  meeting: (investorId: ObjectId, overrides: Partial<Meeting> = {}): Meeting => ({
    _id: faker.string.uuid() as ObjectId,
    date: faker.date.future(),
    status: faker.helpers.arrayElement(['scheduled', 'completed', 'cancelled']),
    notes: faker.lorem.paragraph(),
    investor_id: investorId,
    qas: [],
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    ...overrides
  }),

  qa: (investorId: ObjectId, meetingId: ObjectId, overrides: Partial<QA> = {}): QA => ({
    _id: faker.string.uuid() as ObjectId,
    status: faker.helpers.arrayElement(['pending', 'answered', 'closed']),
    priority: faker.helpers.arrayElement(['high', 'medium', 'low']),
    responses: [],
    attachments: [],
    investor_id: investorId,
    meeting_id: meetingId,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    ...overrides
  }),

  widget: (overrides: Partial<Widget> = {}): Widget => ({
    _id: faker.string.uuid() as ObjectId,
    type: faker.helpers.arrayElement(['chart', 'table', 'metrics']),
    settings: {},
    layout: {
      x: faker.number.int({ min: 0, max: 10 }),
      y: faker.number.int({ min: 0, max: 10 }),
      w: faker.number.int({ min: 1, max: 4 }),
      h: faker.number.int({ min: 1, max: 4 })
    },
    refreshInterval: faker.number.int({ min: 30, max: 300 }),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    ...overrides
  })
};