// src/mocks/test-utils/setup.ts
import { setupServer } from 'msw/node';
import { authHandlers } from '../handlers/auth';
import { investorHandlers } from '../handlers/investors';
import { websocketHandlers } from '../handlers/websocket';

export const server = setupServer(
  ...authHandlers,
  ...investorHandlers,
  ...websocketHandlers
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());